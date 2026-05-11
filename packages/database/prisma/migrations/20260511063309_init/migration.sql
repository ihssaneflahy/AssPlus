-- CreateEnum
CREATE TYPE "TypeContact" AS ENUM ('EMAIL', 'TELEPHONE', 'ADRESSE');

-- CreateEnum
CREATE TYPE "TypeClient" AS ENUM ('PERSONNE_PHYSIQUE', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('SUPER_ADMIN', 'ADMIN_AGENCE', 'GESTIONNAIRE', 'LECTEUR');

-- CreateEnum
CREATE TYPE "TypeEmission" AS ENUM ('AFFAIRE_NOUVELLE', 'RENOUVELLEMENT', 'AVENANT_DE_PERCEPTION', 'AVENANT_DE_RISTOURNE', 'RESILIATION', 'ANNULATION');

-- CreateEnum
CREATE TYPE "StatutPrime" AS ENUM ('EMISE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "TypeDetailEncaissement" AS ENUM ('CHEQUE', 'ESPECE', 'VIREMENT', 'REPORT');

-- CreateEnum
CREATE TYPE "StatutDetailEncaissement" AS ENUM ('EN_ATTENTE', 'ENCAISSE', 'RETOURNE_IMPAYE');

-- CreateEnum
CREATE TYPE "StatutEncaissement" AS ENUM ('EN_COURS', 'VALIDE', 'ANNULE');

-- CreateEnum
CREATE TYPE "StatutVersement" AS ENUM ('BROUILLON', 'VALIDE', 'VIRE');

-- CreateTable
CREATE TABLE "agences" (
    "id" TEXT NOT NULL,
    "code_compagnie" TEXT NOT NULL,
    "code_secteur" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_agence" (
    "id" TEXT NOT NULL,
    "type_contact" "TypeContact" NOT NULL,
    "valeur" TEXT NOT NULL,
    "agence_id" TEXT NOT NULL,

    CONSTRAINT "contacts_agence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ribs_agence" (
    "id" TEXT NOT NULL,
    "banque" TEXT NOT NULL,
    "rib" TEXT NOT NULL,
    "agence_id" TEXT NOT NULL,

    CONSTRAINT "ribs_agence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nom_complet" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "RoleUser" NOT NULL DEFAULT 'GESTIONNAIRE',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "derniere_connexion" TIMESTAMP(3),
    "agence_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "type_client" "TypeClient" NOT NULL,
    "cin" TEXT,
    "ice" TEXT,
    "nom_complet" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "agence_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_client" (
    "id" TEXT NOT NULL,
    "type_contact" "TypeContact" NOT NULL,
    "valeur" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "contacts_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "primes" (
    "id" TEXT NOT NULL,
    "numero_police" TEXT,
    "date_emission" TIMESTAMP(3) NOT NULL,
    "date_effet" TIMESTAMP(3),
    "date_echeance" TIMESTAMP(3),
    "type_emission" "TypeEmission" NOT NULL,
    "resume_vente" JSONB,
    "montant_ttc" DECIMAL(15,2) NOT NULL,
    "montant_net" DECIMAL(15,2) NOT NULL,
    "commission_brute" DECIMAL(15,2) NOT NULL,
    "commission_net" DECIMAL(15,2) NOT NULL,
    "statut" "StatutPrime" NOT NULL DEFAULT 'EMISE',
    "date_statut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,
    "agence_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encaissements" (
    "id" TEXT NOT NULL,
    "date_saisie" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant_total" DECIMAL(15,2) NOT NULL,
    "statut" "StatutEncaissement" NOT NULL DEFAULT 'EN_COURS',
    "date_statut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,
    "agence_id" TEXT NOT NULL,
    "saisi_par_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "encaissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_encaissement_prime" (
    "id" TEXT NOT NULL,
    "montant_affecte" DECIMAL(15,2) NOT NULL,
    "encaissement_id" TEXT NOT NULL,
    "prime_id" TEXT NOT NULL,

    CONSTRAINT "lignes_encaissement_prime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details_encaissement" (
    "id" TEXT NOT NULL,
    "type" "TypeDetailEncaissement" NOT NULL,
    "montant" DECIMAL(15,2) NOT NULL,
    "num_cheque" TEXT,
    "date_versement" TIMESTAMP(3),
    "num_virement" TEXT,
    "statut" "StatutDetailEncaissement" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_statut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encaissement_id" TEXT NOT NULL,
    "versement_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "details_encaissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versements_banque" (
    "id" TEXT NOT NULL,
    "date_versement" TIMESTAMP(3) NOT NULL,
    "nom_banque" TEXT NOT NULL,
    "compte_banque" TEXT NOT NULL,
    "montant_total" DECIMAL(15,2) NOT NULL,
    "montant_espece" DECIMAL(15,2),
    "statut" "StatutVersement" NOT NULL DEFAULT 'BROUILLON',
    "date_statut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agence_id" TEXT NOT NULL,
    "cree_par_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "versements_banque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agences_code_compagnie_key" ON "agences"("code_compagnie");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cin_agence_id_key" ON "clients"("cin", "agence_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_ice_agence_id_key" ON "clients"("ice", "agence_id");

-- CreateIndex
CREATE UNIQUE INDEX "lignes_encaissement_prime_encaissement_id_prime_id_key" ON "lignes_encaissement_prime"("encaissement_id", "prime_id");

-- AddForeignKey
ALTER TABLE "contacts_agence" ADD CONSTRAINT "contacts_agence_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ribs_agence" ADD CONSTRAINT "ribs_agence_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts_client" ADD CONSTRAINT "contacts_client_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "primes" ADD CONSTRAINT "primes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "primes" ADD CONSTRAINT "primes_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encaissements" ADD CONSTRAINT "encaissements_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encaissements" ADD CONSTRAINT "encaissements_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encaissements" ADD CONSTRAINT "encaissements_saisi_par_id_fkey" FOREIGN KEY ("saisi_par_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_encaissement_prime" ADD CONSTRAINT "lignes_encaissement_prime_encaissement_id_fkey" FOREIGN KEY ("encaissement_id") REFERENCES "encaissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_encaissement_prime" ADD CONSTRAINT "lignes_encaissement_prime_prime_id_fkey" FOREIGN KEY ("prime_id") REFERENCES "primes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details_encaissement" ADD CONSTRAINT "details_encaissement_encaissement_id_fkey" FOREIGN KEY ("encaissement_id") REFERENCES "encaissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "details_encaissement" ADD CONSTRAINT "details_encaissement_versement_id_fkey" FOREIGN KEY ("versement_id") REFERENCES "versements_banque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements_banque" ADD CONSTRAINT "versements_banque_agence_id_fkey" FOREIGN KEY ("agence_id") REFERENCES "agences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements_banque" ADD CONSTRAINT "versements_banque_cree_par_id_fkey" FOREIGN KEY ("cree_par_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
