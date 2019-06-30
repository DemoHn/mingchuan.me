import { randomBytes, pbkdf2, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
const pbkdf2Consts = {
  iterationTimes: 60000, // should be less than 2^32 - 1, at least 50000
  keyLength: 128, // less than 255
  saltLength: 16, // less than 255, at least 16
  digestAlgorithm: 'sha512',
}

export async function generatePassowrdHash(password: string): Promise<Buffer> {
  // password hash format:
  // [<alg>...] \0 [keyLength (1b)] [saltLength (1b)] [iterationTimes (4b)] [salt] [hash]
  const { iterationTimes, keyLength, saltLength, digestAlgorithm } = pbkdf2Consts
  // generate salt
  const salt = randomBytes(saltLength)
  // generate hash
  const hash = await promisify(pbkdf2)(
    password,
    salt,
    iterationTimes,
    keyLength,
    digestAlgorithm
  )
  // compose it together
  const algHeader = Buffer.concat([
    Buffer.from(digestAlgorithm, 'ascii'),
    Buffer.from([0x00]),
  ])

  const buf = Buffer.allocUnsafe(6)
  buf.writeUInt8(keyLength, 0)
  buf.writeUInt8(saltLength, 1)
  buf.writeUInt32BE(iterationTimes, 2)

  const header = Buffer.concat([algHeader, buf])

  return Buffer.concat([header, salt, hash])
}

export async function verifyPasswordHash(
  password: string,
  passwordHash: Buffer
): Promise<boolean> {
  // parse alg
  const algIndex = passwordHash.indexOf(0x00)
  if (algIndex < 0) {
    throw new Error('malformed passwordHash')
  }

  const alg = passwordHash.slice(0, algIndex).toString()
  // parse length
  const headersBuf = passwordHash.slice(algIndex + 1, algIndex + 7)
  const keyLength = headersBuf.readUInt8(0)
  const saltLength = headersBuf.readUInt8(1)
  const iterationTimes = headersBuf.readUInt32BE(2)

  // parse salt
  const salt = passwordHash.slice(algIndex + 7, algIndex + 7 + saltLength)
  const hash = passwordHash.slice(algIndex + 7 + saltLength)

  const newHash = await promisify(pbkdf2)(password, salt, iterationTimes, keyLength, alg)

  return timingSafeEqual(newHash, hash)
}
