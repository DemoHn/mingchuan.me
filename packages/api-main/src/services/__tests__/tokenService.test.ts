import { generatePassowrdHash, verifyPasswordHash } from '../tokenService'

describe('Service: TokenService', () => {
  test('should generate password, no duplicates', async () => {
    const password = 'password'
    const h1 = await generatePassowrdHash(password)
    const h2 = await generatePassowrdHash(password)

    expect(h1).not.toEqual(h2)
  })

  test('should generate password, no duplicates, diff password', async () => {
    const password = 'password'
    const p2 = 'p2'
    const h1 = await generatePassowrdHash(password)
    const h2 = await generatePassowrdHash(p2)

    expect(h1).not.toEqual(h2)
  })

  test('should verify password', async () => {
    const p1 = 'password'
    const h1 = await generatePassowrdHash(p1)
    const res = await verifyPasswordHash(p1, h1)

    expect(res).toEqual(true)
  })

  test('should not verify password when password is different', async () => {
    const p1 = 'password'
    const p2 = 'p2'
    const h1 = await generatePassowrdHash(p1)
    const res = await verifyPasswordHash(p2, h1)

    expect(res).toEqual(false)
  })
})
