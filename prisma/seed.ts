import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Você pode adicionar dados iniciais aqui se quiser
  console.log('Database seeded...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 