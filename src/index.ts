import JSZip from 'jszip'
import { version } from '../package.json'
import uid from './uid'
import Obfuscator from './obfuscator'
import InvisibleUUID from './invisibleUUID'
import { minify } from 'terser'
;(async function (Scratch) {
  if (Scratch.extensions.unsandboxed === false) {
    throw new Error('Sandboxed mode is not supported')
  }
  const vm = Scratch.vm
  const runtime = vm.runtime as VM.Runtime & {
    gandi?: unknown
  }
  if (!runtime.precompile) {
    alert('No compiler available. Please run this script on Turbowarp.')
    throw new Error('No compiler available.')
  }
  if (runtime.gandi) {
    alert('Gandi IDE is not supported. Please run this script on Turbowarp.')
    throw new Error('Gandi IDE is not supported.')
  }
  /*
  
  async function requireCompatBlockUtility() {
    return (await fetch('https://cdn.jsdelivr.net/gh/turbowarp/scratch-vm@develop/src/compiler/compat-block-utility.js')).text()
  }
  const [baseRuntime, runtimeFunctions] = await requireRuntimeFunctions()
  const compatBlockUtility = await requireCompatBlockUtility()
  */

  async function compile(
    source: any,
    signatureMap?: Record<string, Record<string, string>>
  ) {
    async function obfuscateCode(code: string) {
      const result = await minify(code, {
        compress: true
      })
      return result.code
    }
    const yOffset = 150
    const xOffset = 250
    const project = structuredClone(source)
    console.log('🤖 Compiling the project')
    vm.runtime.precompile()
    console.group('🛠️ Rebuilding the project with compiled code')
    for (const [index, target] of Object.entries(vm.runtime.targets)) {
      console.group(`👾 Working in sprite ${target.sprite.name}`)
      let hasBlock = false
      let yIndex = 0
      let xIndex = 0
      project.targets[index].blocks = {}
      // delete comments
      for (const [id, value] of Object.entries(
        project.targets[index].comments
      )) {
        if (
          !project.targets[index].isStage ||
          !(value as any).text.endsWith('// _twconfig_')
        )
          delete project.targets[index].comments[id]
      }
      // compile all code below the hat to Javascript
      type Cacheable = {
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
        (target.blocks as unknown as Cacheable)._cache.compiledScripts
      )) {
        if (compiledResult.success) {
          // 拷贝 hat
          const hat = (project.targets[index].blocks[hatId] = structuredClone(
            source.targets[index].blocks[hatId]
          ))
          if (hat.x !== undefined && hat.x !== undefined) {
            if (yIndex > 5) {
              yIndex = 0
              xIndex++
            }
            hat.x = xIndex * xOffset
            hat.y = yIndex * yOffset
            yIndex++
          }
          if (hat.next) {
            hasBlock = true
            project.targets[index].blocks[hat.next] = {
              opcode: 'kylinRuntime_compile',
              next: null,
              parent: hatId,
              inputs: {},
              mutation: {
                tagName: 'mutation',
                children: [],
                code: await obfuscateCode(
                  compiledResult.value.startingFunction.toString()
                )
              },
              fields: {},
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
        (target.blocks as unknown as Cacheable)._cache.compiledProcedures
      )) {
        const definition = (project.targets[index].blocks[
          procedureInfo.topBlockId
        ] = structuredClone(
          source.targets[index].blocks[procedureInfo.topBlockId]
        ))
        if (definition.x !== undefined && definition.x !== undefined) {
          if (yIndex > 5) {
            yIndex = 0
            xIndex++
          }
          definition.x = xIndex * xOffset
          definition.y = yIndex * yOffset
          yIndex++
        }
        const prototype = (project.targets[index].blocks[
          definition.inputs.custom_block[1]
        ] = structuredClone(
          source.targets[index].blocks[definition.inputs.custom_block[1]]
        ))
        for (const [, parameterId] of Object.values(prototype.inputs) as any) {
          // Clone parameters
          if (parameterId)
            project.targets[index].blocks[parameterId] = structuredClone(
              source.targets[index].blocks[parameterId]
            )
        }
        if (definition.next) {
          hasBlock = true
          console.log(`🖋️ Rebuilding procedure ${procedureInfo.topBlockId}`)
          project.targets[index].blocks[definition.next] = {
            opcode: 'kylinRuntime_compile',
            next: null,
            parent: procedureInfo.topBlockId,
            inputs: {},
            mutation: {
              tagName: 'mutation',
              children: [],
              code: await obfuscateCode(
                procedureInfo.cachedCompileResult.toString()
              )
            },
            fields: {},
            shadow: definition.shadow,
            topLevel: false
          }
        }
      }
      if (!hasBlock) console.log('ℹ️ Nothing to do in this sprite')
      console.groupEnd()
    }
    if (Array.isArray(project.extensions)) {
      // keep original extensions
      for (const extension of project.extensions) {
        let opcode = null
        for (const target of source.targets) {
          for (const block of Object.values(target.blocks) as any) {
            if (
              typeof block === 'object' &&
              block !== null &&
              !Array.isArray(block) &&
              block.opcode.startsWith(`${extension}_`)
            ) {
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
          project.targets[0].blocks[uid()] = {
            opcode,
            next: null,
            parent: null,
            inputs: {},
            fields: {},
            shadow: true,
            topLevel: true
          }
        } else {
          console.log(
            `❌ Failed to add extension '${extension}' as dependency: skipping`
          )
        }
      }
      project.extensions.push('kylinRuntime')
    }
    console.log('🔽 Injecting Kylin Runtime')
    if (
      typeof project.extensionURLs !== 'object' ||
      project.extensionURLs === null
    ) {
      project.extensionURLs = {}
    }
    project.extensionURLs['kylinRuntime'] = `data:text/javascript;base64,${btoa(
      Array.from(
        new TextEncoder().encode(
          `// You need to allow this extension to load unsandboxed in order to run the project.\n${
            (
              await minify(
                `(${async function (
                  Scratch: typeof globalThis.Scratch,
                  version: string,
                  signatureMap?: Record<string, Record<string, string>>
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
                      'kylinRuntime.about': '关于 Kylin 编译器',
                      'kylinRuntime.compile': '(已编译)'
                    },
                    ja: {
                      'kylinRuntime.about': 'Kylin コンパイラーについて',
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

                  console.groupCollapsed(`🛠️ Kylin v${version}`)
                  console.log('Kylin is based on Turbowarp compiler.')
                  console.log(
                    'Kylin compiler is distributed under the AGPL-3.0 license.'
                  )
                  console.log('Copyright (c) 2024 FurryR, inspired by VeroFess')
                  console.groupEnd()
                  const procedureCache = {}
                  const spriteNameCache = {}
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
                  function kylinCompileHat(
                    code: string,
                    thread: any
                  ): GeneratorFunction {
                    return kylinCompileGenerator(code)(thread)
                  }
                  let warpTimer = vm.runtime.compilerOptions.warpTimer
                  Object.defineProperty(vm.runtime, 'compilerOptions', {
                    get() {
                      return Object.defineProperty(
                        { enabled: true },
                        'warpTimer',
                        {
                          get() {
                            return warpTimer
                          },
                          set(v) {
                            warpTimer = v
                          }
                        }
                      )
                    },
                    set(v) {
                      if (
                        v &&
                        typeof v === 'object' &&
                        typeof v.warpTimer === 'boolean'
                      ) {
                        warpTimer = v.warpTimer
                      }
                    }
                  })
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
                            thread.status ===
                              thread.constructor.STATUS_YIELD_TICK
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
                        name: 'Kylin Runtime',
                        color1: '#00ffda',
                        blocks: [
                          {
                            blockType: Scratch.BlockType.LABEL,
                            text: `🛠️ Kylin v${version}`
                          },
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
                    compile(_: unknown, util: any) {
                      const thread = util.thread
                      const code = util.target.blocks.getBlock(
                        thread.peekStack()
                      ).mutation.code
                      if (!globalState.Timer) {
                        util.startStackTimer(0)
                        globalState.blockUtility =
                          requireCompatBlockUtility(util)
                        globalState.Timer = util.stackFrame.timer.constructor
                        delete util.stackFrame.timer
                      }
                      const fn = kylinCompileHat(code, thread)
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
                            const spriteName =
                              thread.target.sprite.name in spriteNameCache
                                ? spriteNameCache[thread.target.sprite.name]
                                : (spriteNameCache[thread.target.sprite.name] =
                                    thread.target.sprite.name.startsWith(
                                      '#modules/MiscProtection/'
                                    )
                                      ? thread.target.sprite.name.substring(24)
                                      : thread.target.sprite.name)
                            if (signatureMap && spriteName in signatureMap) {
                              realSignature =
                                signatureMap[spriteName][realSignature] ??
                                realSignature
                            }
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
                                v =>
                                  (v as any).opcode === 'procedures_definition'
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
                                  thread.blockContainer._blocks[
                                    prototype.parent
                                  ]
                                const compileCode = definition.next
                                  ? thread.blockContainer._blocks[
                                      definition.next
                                    ]
                                  : null
                                if (
                                  compileCode &&
                                  compileCode.opcode === 'kylinRuntime_compile'
                                ) {
                                  const code = compileCode.mutation.code
                                  if (!(spriteName in procedureCache))
                                    procedureCache[spriteName] = {}
                                  return (procedureCache[spriteName][
                                    realSignature
                                  ] = kylinCompileGenerator(code))(thread)
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
                }.toString()})(Scratch, ${JSON.stringify(version)}, ${JSON.stringify(signatureMap ?? null)})`
              )
            ).code
          }`
        )
      )
        .map(v => String.fromCodePoint(v))
        .join('')
    )}`
    console.groupEnd()
    return project
  }

  class KylinScratch implements Scratch.Extension {
    private enableCompile = true
    private enableObfuscate = true
    private enableMisc = false
    private inputComment?: string
    private inputUUID?: string
    private meta: {
      isKylin: boolean
      isObfuscated: boolean
      isCompiled: boolean
      miscProtection: boolean
      uuid: string | null
      comment: string | null
    } = {
      isKylin: false,
      isObfuscated: false,
      miscProtection: false,
      isCompiled: false,
      uuid: null,
      comment: null
    }
    constructor() {
      const update = (isWorkspaceUpdate: boolean) => {
        this.meta = Obfuscator.fetchMeta(runtime.targets)
        if (isWorkspaceUpdate) vm.extensionManager.refreshBlocks()
      }
      vm.on('workspaceUpdate', () => update(true))
      update(false)
    }
    getInfo() {
      return {
        id: 'kylin',
        name: `🛠️ Kylin v${version}`,
        color1: '#00ffda',
        blocks: this.meta.isKylin
          ? [
              {
                blockType: Scratch.BlockType.BUTTON,
                text: '🔍 About Kylin',
                func: 'project'
              },
              '---' as const,
              {
                blockType: Scratch.BlockType.LABEL,
                text: '✅ Obfuscated'
              },
              {
                blockType: Scratch.BlockType.LABEL,
                text: `${this.meta.isCompiled ? '✅' : '❌'} Compiled`
              },
              {
                blockType: Scratch.BlockType.LABEL,
                text: `${this.meta.miscProtection ? '✅' : '❌'} Misc Protection`
              },
              ...(this.meta.comment
                ? [
                    {
                      blockType: Scratch.BlockType.LABEL,
                      text: `📄 Comment: ${this.meta.comment}`
                    }
                  ]
                : []),
              {
                blockType: Scratch.BlockType.LABEL,
                text: `🔑 UUID: ${this.meta.uuid}`
              }
            ]
          : [
              {
                blockType: Scratch.BlockType.BUTTON,
                text: '🔍 About Kylin',
                func: 'project'
              },
              '---' as const,
              {
                blockType: Scratch.BlockType.BUTTON,
                text: `${this.enableObfuscate ? '✅' : '❌'} Source code protection`,
                func: 'switchObfuscate'
              },
              {
                blockType: Scratch.BlockType.BUTTON,
                text: `${this.enableCompile ? '✅' : '❌'} Precompile`,
                func: 'switchPrecompile'
              },
              {
                blockType: Scratch.BlockType.BUTTON,
                text: `${this.enableMisc ? '✅' : '❌'} Miscellaneous protection`,
                func: 'switchMisc'
              },
              {
                blockType: Scratch.BlockType.BUTTON,
                text: 'Comments',
                func: 'comment'
              },
              {
                blockType: Scratch.BlockType.BUTTON,
                text: 'UUID (Advanced)',
                func: 'uuid'
              },
              '---' as const,
              {
                blockType: Scratch.BlockType.BUTTON,
                text: `🤖 Proceed`,
                func: 'start'
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
    switchObfuscate() {
      this.enableObfuscate = !this.enableObfuscate
      vm.extensionManager.refreshBlocks()
    }
    switchPrecompile() {
      this.enableCompile = !this.enableCompile
      vm.extensionManager.refreshBlocks()
    }
    switchMisc() {
      this.enableMisc = !this.enableMisc
      vm.extensionManager.refreshBlocks()
    }
    comment() {
      this.inputComment = window.prompt(
        "Please input the project's comment.",
        this.inputComment ?? ''
      )
    }
    uuid() {
      const uuid = window.prompt(
        "Please input the project's UUID.",
        this.inputUUID ?? ''
      )
      if (!uuid) return
      if (
        uuid.length !== 36 ||
        !Array.from(uuid.toLowerCase())
          .filter(x => x !== '-')
          .every(x => InvisibleUUID.hex.includes(x))
      ) {
        alert('Invalid v4 UUID.')
        return
      }
      this.inputUUID = uuid.toLowerCase()
    }
    async start() {
      const files = vm.saveProjectSb3DontZip()
      let projectJson = JSON.parse(
        new TextDecoder().decode(files['project.json'])
      )
      let signatureMap: Record<string, Record<string, string>>
      if (this.enableObfuscate) {
        const res = Obfuscator.obfuscate(projectJson)
        projectJson = res.json
        signatureMap = res.signatureMap
      }
      if (this.enableMisc) projectJson = Obfuscator.miscProtection(projectJson)
      if (this.enableCompile)
        projectJson = await compile(projectJson, signatureMap)

      projectJson = Obfuscator.addMeta(projectJson, {
        isObfuscated: this.enableObfuscate,
        isCompiled: this.enableCompile,
        comment: this.inputComment,
        uuid: this.inputUUID
      }).json

      console.log('🧪 Updating the project.')
      files['project.json'] = new TextEncoder().encode(
        JSON.stringify(projectJson)
      )
      console.log('📂 Repacking the project.')

      const zip = JSZip()
      for (const [name, value] of Object.entries(files)) {
        zip.file(name, value)
      }
      const result = await zip.generateAsync({
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        },
        type: 'arraybuffer'
      })
      vm.loadProject(result)
      // this.meta = {
      //   obfuscated: true,
      //   isCompiled: this.enableCompile,
      //   miscProtection: this.enableMisc,
      //   comment: meta.comment,
      //   uuid: meta.uuid
      // }
    }
  }
  Scratch.extensions.register(new KylinScratch())
})(Scratch)
