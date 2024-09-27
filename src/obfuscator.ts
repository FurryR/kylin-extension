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
      obfuscated: boolean
      isCompiled: boolean
      miscProtection: boolean
      uuid: string
      comment: string | null
    } = {
      obfuscated: false,
      isCompiled: false,
      miscProtection: false,
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
            result.obfuscated = true
            result.isCompiled = (block.mutation as any)?.isCompiled === 'true'
            result.uuid = InvisibleUUID.decrypt((block.mutation as any).uuid)
            if ((block.mutation as any).comment) {
              result.comment = (block.mutation as any).comment
            }
            break
          }
        }
      } else {
        if (target.sprite.name.startsWith('#modules/MiscProtection/')) {
          result.miscProtection = true
        }
      }
    }
    return result
  }
  static addMeta(
    json: any,
    {
      uuid: projectUUID,
      comment,
      isCompiled
    }: { uuid?: string; comment?: string; isCompiled: boolean }
  ) {
    projectUUID = projectUUID ?? uuid.v4()
    for (const target of json.targets) {
      // 添加水印 / uuid
      if (target.isStage) {
        target.blocks[uid()] = {
          opcode: 'procedures_call',
          next: null,
          parent: null,
          inputs: {},
          fields: {},
          shadow: true,
          topLevel: true,
          mutation: {
            tagName: 'mutation',
            isKylin: 'true',
            isCompiled: `${isCompiled}`,
            uuid: InvisibleUUID.encrypt(projectUUID),
            ...(comment ? { comment: String(comment) } : {}),
            children: [],
            proccode: '',
            argumentids: '[]',
            warp: 'true'
          }
        }
        break
      }
    }
    return { json, uuid: projectUUID, comment }
  }
  static miscProtection(json: any) {
    for (const target of json.targets) {
      if (!target.isStage) {
        target.name = '#modules/MiscProtection/' + target.name
      }
    }
    return json
  }
  static obfuscate(json: any) {
    const obfuscatedSignatureMap = {}
    // id -> obfuscatedVarName
    const obfuscatedVariableName = {}

    for (const monitor of json.monitors) {
      if (
        ['data_variable', 'data_listcontents'].includes(monitor.opcode) &&
        monitor.visible === true
      ) {
        obfuscatedVariableName[monitor.id] =
          monitor.params.VARIABLE ?? monitor.params.LIST
      }
    }

    for (const target of json.targets) {
      // argument -> obfuscatedArgument
      const obfuscatedArgumentName = {}
      const currentName = target.name
      // // name -> obfuscatedCustomeName
      // const obfuscatedCostumeName = {}

      // 混淆角色名
      if (!target.isStage) {
        target.name = InvisibleUUID.random()
      }

      // signature -> obfuscatedSignature
      const obfuscatedSignatureName = (obfuscatedSignatureMap[target.name] = {})

      // 预先处理
      for (const block of Object.values(target.blocks) as any) {
        if (
          block.opcode === 'data_showvariable' ||
          block.opcode === 'data_showlist' ||
          block.opcode === 'data_hidevariable' ||
          block.opcode === 'data_hidelist'
        ) {
          // 它们是正常的，故不混淆。
          const field = block.fields.VARIABLE ?? block.fields.LIST
          obfuscatedVariableName[field[1]] = field[0]
        }
      }
      // 混淆变量名
      for (const [id, variable] of Object.entries(target.variables)) {
        if (!(id in obfuscatedVariableName)) {
          if (variable[2]) {
            // 云变量
            obfuscatedVariableName[id] = variable[0]
          } else obfuscatedVariableName[id] = InvisibleUUID.random()
        }
        variable[0] = obfuscatedVariableName[id]
      }
      // 混淆列表名
      for (const [id, list] of Object.entries(target.lists)) {
        if (!(id in obfuscatedVariableName)) {
          obfuscatedVariableName[id] = InvisibleUUID.random()
        }
        list[0] = obfuscatedVariableName[id]
      }
      // 混淆代码
      for (const [blockId, block] of Object.entries(target.blocks) as any) {
        if (Array.isArray(block)) {
          delete target.blocks[blockId]
        } else {
          // 混淆积木位置
          delete block.x
          delete block.y
          // block.x = Number.MAX_SAFE_INTEGER
          // block.y = Number.MAX_SAFE_INTEGER
          block.shadow = true
          block.topLevel = true
          // 混淆下拉参数变量名称
          if (block.fields?.VARIABLE) {
            block.fields.VARIABLE[0] =
              obfuscatedVariableName[block.fields.VARIABLE[1]]
          }
          // 混淆下拉参数列表名称
          if (block.fields?.LIST) {
            block.fields.LIST[0] = obfuscatedVariableName[block.fields.LIST[1]]
          }
          // 混淆参数变量/列表名称
          if (block.inputs) {
            for (const value of Object.values(block.inputs)) {
              for (const member of value as any) {
                if (member instanceof Array && member[0] === 12) {
                  if (!(member[2] in obfuscatedVariableName)) {
                    console.error(
                      '❓ 处理时发生错误：不存在的变量',
                      member[1],
                      '，积木 id =',
                      blockId,
                      '，角色 =',
                      currentName,
                      '，变量 id =',
                      member[2]
                    )
                  } else member[1] = obfuscatedVariableName[member[2]]
                }
              }
            }
          }
          // 混淆自制积木显示
          if (block.opcode === 'procedures_call' && block.mutation) {
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
            block.mutation.argumentnames = JSON.stringify(
              JSON.parse(block.mutation.argumentnames).map(original => {
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
              !['is TurboWarp?', 'is compiled?'].includes(block.fields.VALUE[0])
            ) {
              if (!(block.fields.VALUE[0] in obfuscatedArgumentName)) {
                obfuscatedArgumentName[block.fields.VALUE[0]] =
                  InvisibleUUID.random()
              }
              block.fields.VALUE[0] =
                obfuscatedArgumentName[block.fields.VALUE[0]]
            }
          }
        }
      }
      // 删除注释
      for (const [id, value] of Object.entries(target.comments) as any) {
        if (!target.isStage || !value.text.endsWith('// _twconfig_'))
          delete target.comments[id]
      }
    }
    for (const monitor of json.monitors) {
      if (monitor.opcode === 'data_variable') {
        monitor.params.VARIABLE =
          obfuscatedVariableName[monitor.id] ?? InvisibleUUID.random()
      } else if (monitor.opcode === 'data_listcontents') {
        monitor.params.LIST =
          obfuscatedVariableName[monitor.id] ?? InvisibleUUID.random()
      }
    }
    return { signatureMap: obfuscatedSignatureMap, json }
  }
}
