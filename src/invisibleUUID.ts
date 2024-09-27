import * as uuid from 'uuid'

export default class InvisibleUUID {
  static characters = [
    '\u200e',
    '\u200f',
    '\u200d',
    '\u202a',
    '\u202b',
    '\u202c',
    '\u206e',
    '\u206f',
    '\u206b',
    '\u206a',
    '\u206d',
    '\u206c',
    '\u202e',
    '\u200b',
    '\u2060',
    '\ufeff'
  ]
  static hex = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f'
  ]
  static random() {
    return InvisibleUUID.encrypt(uuid.v4())
  }
  /**
   *
   * @param uuid
   */
  static encrypt(uuid: string): string {
    if (uuid.length !== 36) {
      throw new Error('Invalid v4 UUID')
    }
    return Array.from(uuid.toLowerCase())
      .filter(x => x !== '-')
      .map(x => InvisibleUUID.characters[InvisibleUUID.hex.indexOf(x)])
      .join('')
  }
  /**
   *
   * @param str
   */
  static decrypt(str: string): string {
    if (str.length !== 32) {
      throw new Error('Invalid v4 UUID')
    }
    const raw = Array.from(str)
      .map(x => InvisibleUUID.hex[InvisibleUUID.characters.indexOf(x)] ?? '?')
      .join('')
    return `${raw.substring(0, 8)}-${raw.substring(8, 12)}-${raw.substring(
      12,
      16
    )}-${raw.substring(16, 20)}-${raw.substring(20)}`
  }
}
