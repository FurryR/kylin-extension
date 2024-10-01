import InvisibleUUID from './invisibleUUID'
import uid from './uid'
import * as uuid from 'uuid'

export default class Obfuscator {
  static obfuscateProccode(str: string): string {
    let state = 0
    let final = ''
    for (const c of str) {
      if (c === '%') {
        if (state === 1) state = 0
        else state = 1
      } else if (state === 1) {
        final += `%${c} `
        state = 0
      }
    }
    return InvisibleUUID.random() + final
  }
  static fetchMeta(targets: VM.Target[]) {
    let result: {
      isKylin: boolean
      isCompiled: boolean
      isObfuscated: boolean
      uuid: string
      comment: string | null
    } = {
      isKylin: false,
      isCompiled: false,
      isObfuscated: false,
      uuid: '',
      comment: null
    }
    for (const target of targets) {
      if (target.isStage) {
        for (const block of Object.values(target.blocks._blocks)) {
          if (
            block.opcode === 'procedures_call' &&
            (block.mutation as any)?.isKylin === 'true'
          ) {
            result.isKylin = true
            result.isObfuscated =
              (block.mutation as any)?.isObfuscated === 'true'
            result.isCompiled = (block.mutation as any)?.isCompiled === 'true'
            result.uuid = InvisibleUUID.decrypt((block.mutation as any).uuid)
            if ((block.mutation as any).comment) {
              result.comment = (block.mutation as any).comment
            }
            break
          }
        }
        break
      }
    }
    return result
  }
  static addMeta(
    runtime: VM.Runtime,
    {
      uuid: projectUUID,
      comment,
      isCompiled,
      isObfuscated
    }: {
      uuid?: string
      comment?: string
      isCompiled: boolean
      isObfuscated: boolean
    }
  ) {
    const sprites = new Set(runtime.targets.map(v => v.sprite))
    projectUUID = projectUUID ?? uuid.v4()
    for (const sprite of sprites) {
      // 添加水印 / uuid
      if (sprite.clones[0].isStage) {
        const id = uid()
        sprite.blocks._blocks[id] = {
          id,
          opcode: 'procedures_call',
          inputs: {},
          fields: {},
          next: null,
          topLevel: true,
          parent: null,
          shadow: true,
          mutation: {
            tagName: 'mutation',
            isKylin: 'true',
            isCompiled: `${isCompiled}`,
            isObfuscated: `${isObfuscated}`,
            uuid: InvisibleUUID.encrypt(projectUUID),
            ...(comment ? { comment: String(comment) } : {}),
            children: [],
            proccode: '',
            argumentids: '[]',
            warp: 'true'
          } as any
        }
        sprite.blocks.resetCache()
        break
      }
    }
    return { uuid: projectUUID, comment }
  }
  static obfuscate(runtime: VM.Runtime) {
    const obfuscatedSignatureMap = {}
    // name -> obfuscatedVarName
    const obfuscatedVariableName = {}
    const sprites = new Set(runtime.targets.map(v => v.sprite))

    for (const sprite of sprites) {
      // argument -> obfuscatedArgument
      const obfuscatedArgumentName = {}
      const currentName = sprite.name
      // name -> obfuscatedCustomeName
      // const obfuscatedCostumeName = {}

      // 混淆角色名
      // if (!sprite.clones[0].isStage) {
      //   sprite.name = InvisibleUUID.random()
      // }

      // signature -> obfuscatedSignature
      const obfuscatedSignatureName = (obfuscatedSignatureMap[currentName] = {})

      // 预先处理
      for (const block of Object.values(sprite.blocks._blocks)) {
        if (
          block.opcode === 'data_showvariable' ||
          block.opcode === 'data_showlist' ||
          block.opcode === 'data_hidevariable' ||
          block.opcode === 'data_hidelist'
        ) {
          // 它们是正常的，故不混淆。
          const field = block.fields.VARIABLE ?? block.fields.LIST
          obfuscatedVariableName[field.value] = field.value
        }
      }
      // 混淆变量/列表名
      for (const variable of Object.values(sprite.clones[0].variables)) {
        if (!(variable.name in obfuscatedVariableName)) {
          if (variable.isCloud || variable.type === 'broadcast_msg') {
            // 云变量
            obfuscatedVariableName[variable.name] = variable.name
          } else obfuscatedVariableName[variable.name] = InvisibleUUID.random()
        }
        variable.name = obfuscatedVariableName[variable.name]
      }
      // 混淆代码
      for (const [blockId, block] of Object.entries(sprite.blocks._blocks)) {
        if (!sprite.blocks.getBlock(blockId)) continue
        if (
          !block.parent &&
          !runtime.getIsHat(block.opcode) &&
          block.opcode !== 'procedures_definition'
        ) {
          // Block trim
          ;(sprite.blocks as any).deleteBlock(block.id)
        } else {
          // 混淆积木位置
          delete (block as any).x
          delete (block as any).y

          block.shadow = true
          block.topLevel = true
          // 混淆下拉参数变量名称
          if (block.fields?.VARIABLE) {
            block.fields.VARIABLE.value =
              obfuscatedVariableName[block.fields.VARIABLE.value]
          }
          // 混淆下拉参数列表名称
          if (block.fields?.LIST) {
            block.fields.LIST.value =
              obfuscatedVariableName[block.fields.LIST.value]
          }
          // 混淆参数变量/列表名称
          // if (
          //   block.opcode === 'data_variable' ||
          //   block.opcode === 'data_listcontents'
          // ) {
          //   const variable = block.fields.LIST ?? block.fields.VARIABLE
          //   if (!(variable.value in obfuscatedVariableName)) {
          //     console.error(
          //       '❓ Non-existent variable name',
          //       variable.value,
          //       ', block id =',
          //       blockId,
          //       ', sprite =',
          //       currentName,
          //       ', variable id =',
          //       variable.id
          //     )
          //   } else variable.value = obfuscatedVariableName[variable.value]
          // } else
          if (block.opcode === 'procedures_call' && block.mutation) {
            // 混淆自制积木显示
            if (!(block.mutation.proccode in obfuscatedSignatureName)) {
              obfuscatedSignatureName[block.mutation.proccode] =
                Obfuscator.obfuscateProccode(block.mutation.proccode)
            }
            block.mutation.proccode =
              obfuscatedSignatureName[block.mutation.proccode]
          } else if (
            block.opcode === 'procedures_prototype' &&
            block.mutation
          ) {
            ;(block.mutation as VM.ProcedurePrototypeMutation).argumentnames =
              JSON.stringify(
                JSON.parse(
                  (block.mutation as VM.ProcedurePrototypeMutation)
                    .argumentnames
                ).map(original => {
                  if (!(original in obfuscatedArgumentName)) {
                    obfuscatedArgumentName[original] = InvisibleUUID.random()
                  }
                  return obfuscatedArgumentName[original]
                })
              )
            if (!(block.mutation.proccode in obfuscatedSignatureName)) {
              obfuscatedSignatureName[block.mutation.proccode] =
                Obfuscator.obfuscateProccode(block.mutation.proccode)
            }
            block.mutation.proccode =
              obfuscatedSignatureName[block.mutation.proccode]
          } else if (
            block.opcode === 'argument_reporter_string_number' ||
            block.opcode === 'argument_reporter_boolean'
          ) {
            if (
              !['is TurboWarp?', 'is compiled?'].includes(
                block.fields.VALUE.value
              )
            ) {
              if (!(block.fields.VALUE.value in obfuscatedArgumentName)) {
                obfuscatedArgumentName[block.fields.VALUE.value] =
                  InvisibleUUID.random()
              }
              block.fields.VALUE.value =
                obfuscatedArgumentName[block.fields.VALUE.value]
            }
          } else if (block.opcode === 'sensing_of' && block.fields.PROPERTY) {
            if (block.fields.PROPERTY.value in obfuscatedVariableName) {
              block.fields.PROPERTY.value =
                obfuscatedVariableName[block.fields.PROPERTY.value]
            }
          }
        }
      }
      // 删除注释
      for (const [id, value] of Object.entries(
        sprite.clones[0].comments
      ) as any) {
        if (sprite.clones[0].isStage && value.text.endsWith('// _twconfig_'))
          continue
        delete sprite.clones[0].comments[id]
      }
      sprite.blocks.resetCache()
    }
    // TODO: monitor
    // for (const monitor of json.monitors) {
    //   if (monitor.opcode === 'data_variable') {
    //     monitor.params.VARIABLE =
    //       obfuscatedVariableName[monitor.id] ?? InvisibleUUID.random()
    //   } else if (monitor.opcode === 'data_listcontents') {
    //     monitor.params.LIST =
    //       obfuscatedVariableName[monitor.id] ?? InvisibleUUID.random()
    //   }
    // }
  }
}
