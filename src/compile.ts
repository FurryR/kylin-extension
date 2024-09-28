import uid from './uid'
import { minify } from 'terser'
import { version } from '../package.json'

export default async function compile(runtime: VM.Runtime) {
  const compiledCode: string[] = []
  async function obfuscateCode(code: string) {
    const result = await minify(code, {
      compress: true
    })
    return result.code
  }
  function nextCompiledCode(code: string): number {
    return compiledCode.push(code) - 1
  }
  const yOffset = 150
  const xOffset = 250
  const stageSprite = runtime.getTargetForStage().sprite
  const loadedExtensions: Map<string, string> = (
    runtime.extensionManager as any
  )._loadedExtensions
  const workerURLs: string[] = (runtime.extensionManager as any).workerURLs
  const sprites = new Set(runtime.targets.map(v => v.sprite))
  const extensionBlocks: Record<string, VM.Block> = {}
  if (loadedExtensions.size > 0) {
    // keep original extensions
    for (const extension of loadedExtensions.keys()) {
      if (extension === 'kylin') continue
      let opcode = null
      for (const sprite of sprites) {
        for (const block of Object.values(sprite.blocks._blocks)) {
          if (block.opcode.startsWith(`${extension}_`)) {
            opcode = block.opcode
            break
          }
        }
        if (opcode !== null) {
          break
        }
      }
      if (opcode !== null) {
        console.log(`🔒 Adding extension '${extension}' as dependency`)
        // add an invisible block to keep the extension.
        const id = uid()
        extensionBlocks[id] = {
          id,
          opcode,
          next: null,
          parent: null,
          inputs: {},
          fields: {},
          mutation: null,
          shadow: true,
          topLevel: true
        }
      } else {
        console.log(
          `❌ Failed to add extension '${extension}' as dependency: skipping`
        )
      }
    }
  }
  console.log('🤖 Compiling the project')
  runtime.precompile()
  console.groupCollapsed('🛠️ Rebuilding the project with compiled code')
  let spriteNumber = 0

  for (const sprite of sprites) {
    console.groupCollapsed(`👾 Working in sprite ${++spriteNumber}`)
    let hasBlock = false
    let yIndex = 0
    let xIndex = 0
    const newBlocks: Record<string, VM.Block> = {}
    // delete comments
    for (const [id, value] of Object.entries(sprite.clones[0].comments)) {
      if (sprite.clones[0].isStage && value.text.endsWith('// _twconfig_'))
        continue
      delete sprite.clones[0].comments[id]
    }
    // compile all code below the hat to Javascript
    type Cacheable = VM.Blocks & {
      _cache: {
        compiledScripts: Record<
          string,
          {
            success: boolean
            value: {
              startingFunction: () => void
            }
          }
        >
        compiledProcedures: Record<
          string,
          {
            topBlockId: string
            cachedCompileResult: () => void
          }
        >
      }
    }
    for (const [hatId, compiledResult] of Object.entries(
      (sprite.blocks as Cacheable)._cache.compiledScripts
    )) {
      if (compiledResult.success) {
        // 拷贝 hat
        const hat = (newBlocks[hatId] = structuredClone(
          sprite.blocks.getBlock(hatId)
        ))
        if ((hat as any).x !== undefined && (hat as any).x !== undefined) {
          if (yIndex > 5) {
            yIndex = 0
            xIndex++
          }
          ;(hat as any).x = xIndex * xOffset
          ;(hat as any).y = yIndex * yOffset
          yIndex++
        }
        if (hat.next) {
          hasBlock = true
          newBlocks[hat.next] = {
            id: hat.next,
            opcode: 'kylinRuntime_compile',
            next: null,
            parent: hatId,
            inputs: {},
            mutation: null,
            fields: {
              code: {
                id: null,
                name: 'code',
                value: String(
                  nextCompiledCode(
                    await obfuscateCode(
                      compiledResult.value.startingFunction.toString()
                    )
                  )
                )
              }
            },
            shadow: hat.shadow,
            topLevel: false
          }
          console.log(`🖋️ Rebuilding hat ${hatId}`)
        }
      } else {
        // Maybe we should just keep the hat and blocks below when it fails to compile... Whatever.
        console.error(`❌ Failed to rebuild hat ${hatId}: compilation failed`)
      }
    }
    // Rebuild procedures with compiled Javascript.
    for (const procedureInfo of Object.values(
      (sprite.blocks as Cacheable)._cache.compiledProcedures
    )) {
      const definition = (newBlocks[procedureInfo.topBlockId] = structuredClone(
        sprite.blocks.getBlock(procedureInfo.topBlockId)
      ))
      if (
        (definition as any).x !== undefined &&
        (definition as any).y !== undefined
      ) {
        if (yIndex > 5) {
          yIndex = 0
          xIndex++
        }
        ;(definition as any).x = xIndex * xOffset
        ;(definition as any).y = yIndex * yOffset
        yIndex++
      }
      const prototype = (newBlocks[definition.inputs.custom_block.block] =
        structuredClone(
          sprite.blocks.getBlock(definition.inputs.custom_block.block)
        ))
      for (const parameterId of Object.values(prototype.inputs)) {
        // Clone parameters
        if (!parameterId.block) continue // Dead parameter
        newBlocks[parameterId.block] = structuredClone(
          sprite.blocks.getBlock(parameterId.block)
        )
      }
      if (definition.next) {
        hasBlock = true
        console.log(`🖋️ Rebuilding procedure ${procedureInfo.topBlockId}`)
        newBlocks[definition.next] = {
          id: definition.next,
          opcode: 'kylinRuntime_compile',
          next: null,
          parent: procedureInfo.topBlockId,
          inputs: {},
          mutation: null,
          fields: {
            code: {
              id: null,
              name: 'code',
              value: String(
                nextCompiledCode(
                  await obfuscateCode(
                    procedureInfo.cachedCompileResult.toString()
                  )
                )
              )
            }
          },
          shadow: definition.shadow,
          topLevel: false
        }
      }
    }
    sprite.blocks._blocks = newBlocks
    sprite.blocks.resetCache()
    if (!hasBlock) console.log('ℹ️ Nothing to do in this sprite')
    console.groupEnd()
  }
  const extensionData = `data:text/javascript;base64,${btoa(
    Array.from(
      new TextEncoder().encode(
        `// You need to allow this extension to load unsandboxed in order to run the project.\n${
          (
            await minify(
              `(${async function (
                Scratch: typeof globalThis.Scratch,
                sourceMap: string[],
                version: string
              ) {
                if (Scratch.extensions.unsandboxed === false) {
                  throw new Error(
                    'Kylin Runtime needs to be loaded unsandboxed.'
                  )
                }
                const vm = Scratch.vm
                const runtime = vm.runtime
                if (!runtime.precompile) {
                  alert(
                    'No compiler available. Please run this project on Turbowarp.'
                  )
                  throw new Error('No compiler available.')
                }
                Scratch.translate.setup({
                  'zh-cn': {
                    'kylinRuntime.about': '关于 Kylin',
                    'kylinRuntime.compile': '(已编译)'
                  },
                  ja: {
                    'kylinRuntime.about': 'Kylin について',
                    'kylinRuntime.compile': '(コンパイル済)'
                  }
                })
                const [baseRuntime, runtimeFunctions] = await (async () => {
                  const code = await (
                    await fetch(
                      'https://cdn.jsdelivr.net/gh/turbowarp/scratch-vm@develop/src/compiler/jsexecute.js'
                    )
                  ).text()
                  return new Function(
                    'require',
                    'module',
                    code + ';return [baseRuntime, runtimeFunctions]'
                  )(() => undefined, { exports: {} }) as [string, string]
                })()
                const compatBlockUtilityCode = await (async () => {
                  return (
                    await fetch(
                      'https://cdn.jsdelivr.net/gh/turbowarp/scratch-vm@develop/src/compiler/compat-block-utility.js'
                    )
                  ).text()
                })()
                function requireCompatBlockUtility(util: VM.BlockUtility) {
                  if (requireCompatBlockUtility.cache)
                    return requireCompatBlockUtility.cache
                  const module = { exports: {} }
                  new Function('require', 'module', compatBlockUtilityCode)(
                    () => util.constructor,
                    module
                  )
                  return (requireCompatBlockUtility.cache =
                    module.exports as VM.BlockUtility)
                }
                requireCompatBlockUtility.cache = null
                const procedureCache = {}
                const insertRuntime = (source: string) => {
                  let result = baseRuntime
                  for (const functionName of Object.keys(runtimeFunctions)) {
                    if (source.includes(functionName)) {
                      result += `${runtimeFunctions[functionName]};`
                    }
                  }
                  result += `return ${source}`
                  return result
                }
                // From jsexecute
                const globalState = {
                  Cast: Scratch.Cast,
                  log: {},
                  thread: null,
                  Timer: null,
                  blockUtility: null
                }
                const kylinCompilerExecute = (thread: any) => {
                  globalState.thread = thread
                  const result = thread.kylin.next()
                  if (
                    result.done &&
                    thread.status === thread.constructor.STATUS_RUNNING
                  ) {
                    // Procedures do not retire thread automatically so we need to retire the thread manually for them.
                    thread.target.runtime.sequencer.retireThread(thread)
                  }
                }
                function kylinCompileGenerator(
                  code: string
                ): (thread: any) => GeneratorFunction {
                  return new Function('globalState', insertRuntime(code))(
                    globalState
                  )
                }
                console.groupCollapsed(`🛠️ Kylin Runtime v${version}`)
                console.log('Kylin is based on Turbowarp compiler.')
                console.log('Kylin is distributed under the AGPL-3.0 license.')
                console.log('Copyright (c) 2024 FurryR, inspired by VeroFess')
                console.groupCollapsed('🐺 Precompiling function cache')
                const functionMap = sourceMap.map((v, index, arr) => {
                  console.log(
                    `🦖 Compiled function (${index + 1}/${arr.length})`
                  )
                  return kylinCompileGenerator(v)
                })
                console.log('⭐ Done!')
                console.groupEnd()
                console.groupEnd()
                class Kylin {
                  constructor() {
                    const Sequencer = vm.runtime.sequencer.constructor
                    const _stepThread = Sequencer.prototype.stepThread
                    Sequencer.prototype.stepThread = function (thread: any) {
                      if (thread.kylin) {
                        kylinCompilerExecute(thread)
                      } else {
                        _stepThread.call(this, thread)
                        if (
                          thread.kylin &&
                          thread.status === thread.constructor.STATUS_YIELD_TICK
                        ) {
                          thread.status = thread.constructor.STATUS_RUNNING
                          kylinCompilerExecute(thread)
                        }
                      }
                    }
                  }
                  getInfo() {
                    return {
                      id: 'kylinRuntime',
                      name: `🛠️ Kylin Runtime v${version}`,
                      color1: '#00ffda',
                      blocks: [
                        {
                          blockType: Scratch.BlockType.BUTTON,
                          text: `🤖 ${Scratch.translate({
                            id: 'kylinRuntime.about',
                            default: 'About Kylin',
                            description: 'About'
                          })}`,
                          func: 'project'
                        },
                        {
                          blockType: Scratch.BlockType.COMMAND,
                          opcode: 'compile',
                          text: Scratch.translate({
                            id: 'kylinRuntime.compile',
                            default: '(Compiled)',
                            description: 'Precompile'
                          }),
                          hideFromPalette: true
                        }
                      ]
                    }
                  }
                  project() {
                    const link = document.createElement('a')
                    link.href = 'https://github.com/FurryR/kylin-extension'
                    link.target = '_blank'
                    link.click()
                  }
                  compile({ code }: { code: string }, util: any) {
                    const thread = util.thread
                    if (!globalState.Timer) {
                      util.startStackTimer(0)
                      globalState.blockUtility = requireCompatBlockUtility(util)
                      globalState.Timer = util.stackFrame.timer.constructor
                      delete util.stackFrame.timer
                    }
                    const fn = functionMap[Number(code)](thread)
                    if (fn instanceof function* () {}.constructor) {
                      thread.kylin = fn()
                    } else {
                      thread.kylin = (function* () {
                        return fn()
                      })()
                    }
                    thread.procedures = new Proxy(
                      {},
                      {
                        get(_, procedureSignature) {
                          if (typeof procedureSignature === 'symbol')
                            throw new Error('Unexpected procedure signature')
                          let realSignature = procedureSignature.substring(1)
                          const spriteName = thread.target.sprite.name
                          if (
                            spriteName in procedureCache &&
                            realSignature in procedureCache[spriteName]
                          ) {
                            return procedureCache[spriteName][realSignature](
                              thread
                            )
                          }
                          // get prototype for finding procedure
                          const prototypes = Object.values(
                            thread.blockContainer._blocks
                          )
                            .filter(
                              v => (v as any).opcode === 'procedures_definition'
                            )
                            .map(
                              v =>
                                thread.blockContainer._blocks[
                                  (v as any).inputs.custom_block.block
                                ]
                            )
                          for (const prototype of prototypes) {
                            const rawSignature = prototype.mutation.proccode
                            if (realSignature === rawSignature) {
                              const definition =
                                thread.blockContainer._blocks[prototype.parent]
                              const compileCode = definition.next
                                ? thread.blockContainer._blocks[definition.next]
                                : null
                              if (
                                compileCode &&
                                compileCode.opcode === 'kylinRuntime_compile'
                              ) {
                                if (!(spriteName in procedureCache))
                                  procedureCache[spriteName] = {}
                                return (procedureCache[spriteName][
                                  realSignature
                                ] =
                                  functionMap[
                                    Number(compileCode.fields.code.value)
                                  ])(thread)
                              }
                              break
                            }
                          }
                          return function () {
                            console.error(
                              `Kylin: Unknown procedure signature ${procedureSignature}`
                            )
                            return {
                              [Symbol.iterator]: () => ({
                                next: () => ({
                                  done: true,
                                  value: ''
                                })
                              })
                            }
                          }
                        }
                      }
                    )
                    return util.yieldTick()
                  }
                }
                Scratch.extensions.register(new Kylin())
              }.toString()})(Scratch, ${JSON.stringify(compiledCode)}, ${JSON.stringify(version)})`
            )
          ).code
        }`
      )
    )
      .map(v => String.fromCodePoint(v))
      .join('')
  )}`
  Object.assign(stageSprite.blocks._blocks, extensionBlocks)
  console.log('🔽 Injecting Kylin Runtime')
  if (loadedExtensions.has('kylinRuntime')) {
    const serviceName = loadedExtensions.get('kylinRuntime')
    const workerIndex = Number(serviceName.split('.')[1])
    workerURLs[workerIndex] = extensionData
  } else {
    loadedExtensions.set(
      'kylinRuntime',
      `unsandboxed.${workerURLs.length}.kylinRuntime`
    )
    workerURLs.push(extensionData)
  }
  console.groupEnd()
}
