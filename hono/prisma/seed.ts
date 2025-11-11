import process from 'node:process'
import { prisma } from '../src/lib/prisma.js'

export async function main() {}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
