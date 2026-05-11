import { PrismaClient } from '../generated/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Super Admin (accès console d'administration)
  const superAdmin = await prisma.user.upsert({
    where: { login: 'superadmin' },
    update: {},
    create: {
      nomComplet: 'Super Administrateur',
      email: process.env.SUPER_ADMIN_EMAIL ?? 'admin@assplus.ma',
      login: 'superadmin',
      passwordHash: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD ?? 'AssPlus2024!', 12),
      role: 'SUPER_ADMIN',
      agenceId: null,
    },
  });
  console.log(`✅ Super Admin créé: ${superAdmin.email}`);

  // Agence de démonstration
  const agenceExistante = await prisma.agence.findUnique({ where: { codeCompagnie: 'AGC-DEMO-001' } });
  if (!agenceExistante) {
    const agence = await prisma.agence.create({
      data: {
        codeCompagnie: 'AGC-DEMO-001',
        codeSecteur: 'SECTEUR-CASA',
        nom: 'Agence Demo Casablanca',
        responsable: 'Ahmed Benali',
        contacts: {
          create: [
            { typeContact: 'EMAIL', valeur: 'demo@agence.ma' },
            { typeContact: 'TELEPHONE', valeur: '+212 5 22 000 000' },
          ],
        },
        users: {
          create: {
            nomComplet: 'Admin Demo',
            email: 'admin.demo@agence.ma',
            login: 'admin.demo',
            passwordHash: await bcrypt.hash('Demo2024!', 12),
            role: 'ADMIN_AGENCE',
          },
        },
      },
    });
    console.log(`✅ Agence demo créée: ${agence.nom}`);
  }

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
