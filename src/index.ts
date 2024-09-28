import { version } from '../package.json'
import Obfuscator from './obfuscator'
import InvisibleUUID from './invisibleUUID'
import compile from './compile'
;(async function (Scratch) {
  if (Scratch.extensions.unsandboxed === false) {
    throw new Error('Sandboxed mode is not supported')
  }
  const vm = Scratch.vm
  const runtime = vm.runtime as VM.Runtime & {
    gandi?: unknown
  }
  if (!runtime.precompile) {
    alert(
      Scratch.translate({
        id: 'kylin.error.noCompilerAvailable',
        default: 'No compiler available. Please run this script on Turbowarp.',
        description: 'No compiler available right now.'
      })
    )
    throw new Error('No compiler available.')
  }
  if (runtime.gandi) {
    alert(
      Scratch.translate({
        id: 'kylin.error.gandi',
        default:
          'Gandi IDE is not supported yet. Please run this script on Turbowarp.',
        description: 'Gandi IDE is not supported.'
      })
    )
    throw new Error('Gandi IDE is not supported.')
  }

  console.groupCollapsed(`🛠️ Kylin v${version}`)
  console.log('Kylin is based on Turbowarp compiler.')
  console.log('Kylin compiler is distributed under the AGPL-3.0 license.')
  console.log('Copyright (c) 2024 FurryR, inspired by VeroFess')
  console.groupEnd()

  class KylinScratch implements Scratch.Extension {
    private enableCompile = true
    private enableObfuscate = true
    private enableMisc = false
    private compiling = false
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
        blocks:
          this.meta.isKylin && !this.compiling
            ? [
                {
                  blockType: Scratch.BlockType.BUTTON,
                  text: `🔍 ${Scratch.translate({ id: 'kylin.hint.about', default: 'About Kylin', description: 'About kylin obfuscator' })}`,
                  func: 'project'
                },
                '---' as const,
                {
                  blockType: Scratch.BlockType.LABEL,
                  text: `${this.meta.isObfuscated ? '✅' : '❌'} ${Scratch.translate({ id: 'kylin.hint.obfuscated', default: 'Obfuscation', description: 'Is the project obfuscated?' })}`
                },
                {
                  blockType: Scratch.BlockType.LABEL,
                  text: `${this.meta.isCompiled ? '✅' : '❌'} ${Scratch.translate({ id: 'kylin.hint.precompiled', default: 'Precompilation', description: 'Is the project precompiled?' })}`
                },
                {
                  blockType: Scratch.BlockType.LABEL,
                  text: `${this.meta.miscProtection ? '✅' : '❌'} ${Scratch.translate({ id: 'kylin.hint.miscProtection', default: 'Misc Protection', description: 'Does the project has miscellaneous protection?' })}`
                },
                ...(this.meta.comment
                  ? [
                      {
                        blockType: Scratch.BlockType.LABEL,
                        text: `📄 ${Scratch.translate({ id: 'kylin.hint.comment', default: 'Comment', description: 'Comment' })}: ${this.meta.comment}`
                      }
                    ]
                  : []),
                {
                  blockType: Scratch.BlockType.LABEL,
                  text: `🔑 UUID: ${this.meta.uuid}`
                }
              ]
            : this.compiling
              ? [
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `🔍 ${Scratch.translate({ id: 'kylin.hint.about', default: 'About Kylin', description: 'About kylin obfuscator' })}`,
                    func: 'project'
                  },
                  '---' as const,
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: `🐺 ${Scratch.translate({ id: 'kylin.hint.loading', default: 'Loading...', description: 'Loading placeholder' })}`
                  }
                ]
              : [
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `🔍 ${Scratch.translate({ id: 'kylin.hint.about', default: 'About Kylin', description: 'About kylin obfuscator' })}`,
                    func: 'project'
                  },
                  '---' as const,
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `${this.enableObfuscate ? '✅' : '❌'} ${Scratch.translate({ id: 'kylin.hint.obfuscated', default: 'Obfuscation', description: 'Enable/disable source code protection.' })}`,
                    func: 'switchObfuscate'
                  },
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `${this.enableCompile ? '✅' : '❌'} ${Scratch.translate({ id: 'kylin.hint.precompiled', default: 'Precompilation', description: 'Enable/disable precompilation.' })}`,
                    func: 'switchPrecompile'
                  },
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `${this.enableMisc ? '✅' : '❌'} ${Scratch.translate({ id: 'kylin.hint.miscProtection', default: 'Misc Protection', description: 'Enable/disable miscellaneous protection.' })}`,
                    func: 'switchMisc'
                  },
                  '---' as const,
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `📄 ${Scratch.translate({ id: 'kylin.button.comments', default: 'Comments', description: 'Editing comments.' })}`,
                    func: 'comment'
                  },
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `🔑 ${Scratch.translate({ id: 'kylin.button.uuid', default: 'UUID (Advanced)', description: 'Editing UUID (advanced).' })}`,
                    func: 'uuid'
                  },
                  '---' as const,
                  {
                    blockType: Scratch.BlockType.BUTTON,
                    text: `🤖 ${Scratch.translate({ id: 'kylin.button.proceed', default: 'Proceed', description: 'Proceed button.' })}`,
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
      if (this.compiling) return
      this.enableObfuscate = !this.enableObfuscate
      vm.extensionManager.refreshBlocks()
    }
    switchPrecompile() {
      if (this.compiling) return
      this.enableCompile = !this.enableCompile
      vm.extensionManager.refreshBlocks()
    }
    switchMisc() {
      if (this.compiling) return
      this.enableMisc = !this.enableMisc
      vm.extensionManager.refreshBlocks()
    }
    comment() {
      this.inputComment = window.prompt(
        Scratch.translate({
          id: 'kylin.popup.comment',
          default: "Please input the project's comment.",
          description: 'Editing comment popup.'
        }),
        this.inputComment ?? ''
      )
    }
    uuid() {
      const uuid = window.prompt(
        Scratch.translate({
          id: 'kylin.popup.uuid',
          default: "Please input the project's v4 UUID.",
          description: 'Editing UUID popup.'
        }),
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
      this.compiling = true
      vm.extensionManager.refreshBlocks()
      const _step = runtime._step
      runtime._step = function () {}
      if (this.enableObfuscate) Obfuscator.obfuscate(runtime)
      if (this.enableMisc) Obfuscator.miscProtection(runtime)
      if (this.enableCompile) await compile(runtime)

      Obfuscator.addMeta(runtime, {
        isObfuscated: this.enableObfuscate,
        isCompiled: this.enableCompile,
        comment: this.inputComment,
        uuid: this.inputUUID
      })
      console.log('📂 Repacking the project.')
      const blob = await vm.saveProjectSb3()
      if (!runtime._primitives['kylinRuntime_compile']) {
        const loadedExtensions: Map<string, string> = (
          runtime.extensionManager as any
        )._loadedExtensions
        const workerURLs: string[] = (runtime.extensionManager as any)
          .workerURLs
        const serviceName = loadedExtensions.get('kylinRuntime')
        if (serviceName) {
          const workerIndex = Number(serviceName.split('.')[1])
          workerURLs[workerIndex] = ''
        }
        loadedExtensions.delete('kylinRuntime')
      }
      this.compiling = false
      await vm.loadProject(await blob.arrayBuffer())
      runtime._step = _step
    }
  }
  Scratch.extensions.register(new KylinScratch())
})(Scratch)
