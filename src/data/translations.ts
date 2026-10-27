/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    brandName: 'GlobalSphere',
    brandTagline: 'International WhatsApp Contact Exchange',
    navHome: 'Overview',
    navHowItWorks: 'How It Works',
    navConsent: 'Consent & Privacy',
    navPilot: 'Free Pilot',
    navFaq: 'FAQ',
    navRegister: 'Register Free',
    navSignIn: 'Sign In',
    navDashboard: 'Dashboard',
    navDownloads: 'Download Centre',
    navProfile: 'Profile & Consent',
    navReferrals: 'Referrals',
    navHelp: 'Help & Safety',
    navAdmin: 'Admin Console',
    switchModeMember: 'Member View',
    switchModeAdmin: 'Admin Mode',
    sampleDataNotice: 'Phase 1 Demonstration: All data shown is simulated sample data. No real phone numbers are stored or redistributed.',
    
    // Landing Page
    heroHeadline: 'Connect with verified professionals and creators worldwide on WhatsApp.',
    heroSubhead: 'A consensual, international contact exchange. Voluntary registration, transparent privacy controls, weekly curated releases, and zero unconsented data redistribution.',
    heroCtaRegister: 'Join Free Pilot',
    heroCtaHow: 'See How It Works',
    communityInviteNotice: 'Join the community discussion channel. Note: Joining WhatsApp Community does not automatically consent to having your number redistributed.',
    joinCommunityBtn: 'Join Global Discussion Channel',

    // Principles
    step1Title: '1. Voluntary Registration',
    step1Desc: 'Submit your display name and WhatsApp number with international calling code. No forced harvesting.',
    step2Title: '2. Explicit Double Consent',
    step2Desc: 'Grant revocable consent to share your details only with eligible members, understanding download permanence.',
    step3Title: '3. Weekly Contact Releases',
    step3Desc: 'Receive a weekly free contact allocation (up to 50 contacts) in standard VCF format with zero duplicate counts.',
    step4Title: '4. Respectful Growth',
    step4Desc: 'Save contacts directly into your phone address book and connect authentically. Status views are never guaranteed.',

    // Disclaimers & Transparency
    statusDisclaimerTitle: 'Important WhatsApp Status Notice',
    statusDisclaimerText: 'Importing contacts never guarantees WhatsApp Status views. WhatsApp Status visibility requires mutual address book saves and individual WhatsApp privacy settings.',
    noRemoteWipeTitle: 'Contact Permanence Acknowledgment',
    noRemoteWipeText: 'Once eligible members export and save contacts to their phone address books, previously downloaded contacts cannot be remotely deleted from their physical devices if you later withdraw.',
    
    // Pilot info
    pilotBannerTitle: 'Phase 1 Pilot: 100% Free Access',
    pilotBannerText: 'During the pilot launch phase, all eligible participants receive free weekly contact releases. Future paid packages may be introduced after reaching the configurable community milestone (1,000 eligible members).',

    // Auth & Forms
    signInTitle: 'Sign In to Member Portal',
    signInDesc: 'Enter your registered phone number or select a demonstration account to test the platform.',
    signInPhoneLabel: 'WhatsApp Phone Number',
    signInBtn: 'Continue with Demo Account',
    accountRecoveryTitle: 'Account Recovery',
    accountRecoveryDesc: 'In Phase 2, an SMS / WhatsApp OTP will be dispatched. For Phase 1, enter your number to simulate identity restoration.',
    requestRecoveryBtn: 'Send Recovery Code (Simulated)',
    verificationPendingTitle: 'Verification Pending (Phase 2 Preview)',
    verificationPendingDesc: 'In the production release, you will verify your WhatsApp number via one-time PIN (OTP). Real verification will be implemented in Phase 2.',

    // Registration
    regTitle: 'Register for GlobalSphere',
    regStep1: 'Basic Info',
    regStep2: 'Phone & Language',
    regStep3: 'Consent & Review',
    displayNameLabel: 'Display Name / Business Name',
    displayNamePlaceholder: 'e.g. Elena Rostova or Apex Studios',
    countryLabel: 'Country of Residence',
    phoneLabel: 'WhatsApp Number',
    phonePlaceholder: 'e.g. 712345678',
    callingCodeLabel: 'Calling Code',
    langLabel: 'Interface Language',
    referralCodeLabel: 'Referral Code (Optional)',
    referralCodePlaceholder: 'e.g. GS-ALEX99',
    consentCheck1: 'I voluntarily consent to share my display name and normalized WhatsApp number with verified, eligible GlobalSphere members in contact releases.',
    consentCheck2: 'I understand and acknowledge that previously downloaded contact files cannot be remotely deleted or wiped from other participants\' devices if I withdraw my consent later.',
    reviewBeforeSubmit: 'Review Submitted Details',
    submitRegistration: 'Complete Voluntary Registration',
    
    // Member Dashboard
    dashWelcome: 'Welcome back,',
    dashWeeklyAllowance: 'Weekly Free Allowance',
    dashAllowanceRemaining: '50 contacts remaining this week',
    dashNewAvailable: 'New Unique Contacts Available',
    dashLatestRelease: 'Latest Release',
    dashNextRelease: 'Next Incremental Release',
    dashNextReleaseTime: 'Friday at 18:00 UTC',
    dashQuickDownload: 'Quick Download',
    dashDownloadIncremental: 'Download Incremental Release (15 New)',
    dashDownloadFull: 'Download Full Eligible List (48 Contacts)',
    dashReferralCardTitle: 'Your Referral Link',
    dashReferralCount: 'Invited Members',
    
    // Download Centre
    dlTitle: 'Contact Download Centre',
    dlSubhead: 'Download verified, consensual contact files in standard VCF format compatible with Android and iOS.',
    dlFullBtn: 'Download Full List (.vcf)',
    dlIncrementalBtn: 'Download Incremental Batch (.vcf)',
    dlInstructionsAndroid: 'Android Import Instructions: 1. Tap the downloaded .vcf file. 2. Choose "Contacts" or "Google Contacts". 3. Select your Google account to save contacts.',
    dlInstructionsIos: 'iPhone Import Instructions: 1. Open the downloaded .vcf file in Files or Safari. 2. Tap "Add All Contacts". 3. Open WhatsApp and pull down to refresh contacts.',
    dlSuccessToast: 'Demonstration .vcf file downloaded successfully.',
    
    // Profile & Consent
    profileTitle: 'Profile, Privacy & Consent',
    profileSubhead: 'Manage your visibility, contact details, and platform participation rights.',
    consentActiveNotice: 'Your contact details are currently eligible for inclusion in upcoming weekly releases.',
    requestRemovalTitle: 'Request Contact Removal',
    requestRemovalDesc: 'Withdraw from all future weekly releases. Your phone number will be immediately scrubbed from upcoming exports.',
    requestRemovalBtn: 'Withdraw Consent & Request Removal',
    deactivateAccountTitle: 'Account Deactivation',
    deactivateAccountBtn: 'Deactivate Account',
    
    // Referrals & Help
    refTitle: 'Referrals & Member Growth',
    refDesc: 'Share your personal invitation code with fellow creators and entrepreneurs.',
    faqTitle: 'Frequently Asked Questions',
    supportTitle: 'Contact Support & Feedback',
    abuseTitle: 'Report Abuse or Unsolicited Spam',
    
    // Admin
    adminDashboardTitle: 'Admin Operation Console',
    adminNotice: 'Demonstration Admin Environment: Server-side RBAC and real persistence will be bound in Phase 2.',
    adminKpiTotal: 'Total Registrations',
    adminKpiEligible: 'Eligible for Sharing',
    adminKpiCountries: 'Countries Active',
    adminKpiRemovals: 'Removal Requests',
    adminKpiReports: 'Pending Abuse Reports',
    adminKpiThreshold: 'Pilot Threshold Progress',
  },
  fr: {
    // Brand & Header
    brandName: 'GlobalSphere',
    brandTagline: 'Échange International de Contacts WhatsApp',
    navHome: 'Aperçu',
    navHowItWorks: 'Comment ça marche',
    navConsent: 'Consentement & Confidentialité',
    navPilot: 'Pilote Gratuit',
    navFaq: 'FAQ',
    navRegister: 'Inscription Gratuite',
    navSignIn: 'Connexion',
    navDashboard: 'Tableau de bord',
    navDownloads: 'Centre de Téléchargement',
    navProfile: 'Profil & Consentement',
    navReferrals: 'Parrainages',
    navHelp: 'Aide & Sécurité',
    navAdmin: 'Console Admin',
    switchModeMember: 'Vue Membre',
    switchModeAdmin: 'Mode Admin',
    sampleDataNotice: 'Démonstration Phase 1 : Toutes les données affichées sont simulées. Aucun numéro de téléphone réel n\'est stocké ni redistribué.',
    
    // Landing Page
    heroHeadline: 'Connectez-vous avec des professionnels et créateurs vérifiés dans le monde entier sur WhatsApp.',
    heroSubhead: 'Un échange de contacts international et consenti. Inscription volontaire, contrôles de confidentialité transparents, diffusions hebdomadaires sélectionnées, sans redistribution non consentie.',
    heroCtaRegister: 'Rejoindre le Pilote Gratuit',
    heroCtaHow: 'Découvrir le Fonctionnement',
    communityInviteNotice: 'Rejoignez le canal de discussion. Remarque : Rejoindre la Communauté WhatsApp ne signifie pas automatiquement que vous consentez à la redistribution de votre numéro.',
    joinCommunityBtn: 'Rejoindre le Canal de Discussion Global',

    // Principles
    step1Title: '1. Inscription Volontaire',
    step1Desc: 'Soumettez votre nom d\'affichage et votre numéro WhatsApp avec indicatif international. Aucun moissonnage forcé.',
    step2Title: '2. Double Consentement Explicite',
    step2Desc: 'Accordez un consentement révocable pour partager vos coordonnées uniquement avec les membres éligibles, en comprenant la persistance des téléchargements.',
    step3Title: '3. Diffusions Hebdomadaires',
    step3Desc: 'Recevez une allocation hebdomadaire gratuite (jusqu\'à 50 contacts) au format VCF standard sans aucun doublon.',
    step4Title: '4. Croissance Respectueuse',
    step4Desc: 'Enregistrez les contacts directement dans votre carnet d\'adresses. Les vues des statuts WhatsApp ne sont jamais garanties.',

    // Disclaimers & Transparency
    statusDisclaimerTitle: 'Avis Important sur les Statuts WhatsApp',
    statusDisclaimerText: 'L\'importation de contacts ne garantit jamais les vues de statuts WhatsApp. La visibilité des statuts requiert un enregistrement mutuel dans le carnet d\'adresses et dépend des paramètres de confidentialité de chacun.',
    noRemoteWipeTitle: 'Reconnaissance de la Persistance des Contacts',
    noRemoteWipeText: 'Une fois que des membres éligibles exportent et enregistrent des contacts dans leurs téléphones, les contacts précédemment téléchargés ne peuvent pas être supprimés à distance de leurs appareils physiques si vous vous retirez ultérieurement.',

    // Pilot info
    pilotBannerTitle: 'Pilote Phase 1 : Accès 100% Gratuit',
    pilotBannerText: 'Pendant la phase pilote, tous les participants éligibles bénéficient de diffusions hebdomadaires gratuites. Des forfaits payants pourront être introduits après avoir atteint le seuil communautaire configurable (1 000 membres éligibles).',

    // Auth & Forms
    signInTitle: 'Connexion à l\'Espace Membre',
    signInDesc: 'Entrez votre numéro enregistré ou sélectionnez un compte de démonstration pour tester la plateforme.',
    signInPhoneLabel: 'Numéro WhatsApp',
    signInBtn: 'Continuer avec le Compte Démo',
    accountRecoveryTitle: 'Récupération de Compte',
    accountRecoveryDesc: 'En Phase 2, un code SMS / WhatsApp sera envoyé. Pour la Phase 1, entrez votre numéro pour simuler la restauration.',
    requestRecoveryBtn: 'Envoyer le Code (Simulé)',
    verificationPendingTitle: 'Vérification en Attente (Aperçu Phase 2)',
    verificationPendingDesc: 'Dans la version finale, vous confirmerez votre numéro WhatsApp via code PIN unique (OTP). La vérification réelle sera mise en place en Phase 2.',

    // Registration
    regTitle: 'Inscription à GlobalSphere',
    regStep1: 'Informations de Base',
    regStep2: 'Téléphone & Langue',
    regStep3: 'Consentement & Validation',
    displayNameLabel: 'Nom d\'Affichage / Raison Sociale',
    displayNamePlaceholder: 'ex: Elena Rostova ou Studio Apex',
    countryLabel: 'Pays de Résidence',
    phoneLabel: 'Numéro WhatsApp',
    phonePlaceholder: 'ex: 612345678',
    callingCodeLabel: 'Indicatif Téléphonique',
    langLabel: 'Langue de l\'Interface',
    referralCodeLabel: 'Code de Parrainage (Facultatif)',
    referralCodePlaceholder: 'ex: GS-ALEX99',
    consentCheck1: 'Je consens volontairement à partager mon nom d\'affichage et mon numéro WhatsApp normalisé avec les membres vérifiés et éligibles de GlobalSphere.',
    consentCheck2: 'Je comprends et reconnais que les fichiers de contacts précédemment téléchargés ne peuvent pas être effacés à distance des appareils des autres participants si je retire mon consentement par la suite.',
    reviewBeforeSubmit: 'Vérifier les Informations Soumises',
    submitRegistration: 'Finaliser l\'Inscription Volontaire',

    // Member Dashboard
    dashWelcome: 'Bienvenue,',
    dashWeeklyAllowance: 'Allocation Hebdomadaire Gratuite',
    dashAllowanceRemaining: '50 contacts restants cette semaine',
    dashNewAvailable: 'Nouveaux Contacts Uniques Disponibles',
    dashLatestRelease: 'Dernière Diffusion',
    dashNextRelease: 'Prochaine Diffusion Incrémentale',
    dashNextReleaseTime: 'Vendredi à 18h00 UTC',
    dashQuickDownload: 'Téléchargement Rapide',
    dashDownloadIncremental: 'Télécharger la Diffusion Incrémentale (15 Nouveaux)',
    dashDownloadFull: 'Télécharger la Liste Complète (48 Contacts)',
    dashReferralCardTitle: 'Votre Lien de Parrainage',
    dashReferralCount: 'Membres Invités',

    // Download Centre
    dlTitle: 'Centre de Téléchargement des Contacts',
    dlSubhead: 'Téléchargez des fichiers de contacts vérifiés et consentis au format standard VCF compatible Android et iOS.',
    dlFullBtn: 'Télécharger la Liste Complète (.vcf)',
    dlIncrementalBtn: 'Télécharger le Lot Incrémental (.vcf)',
    dlInstructionsAndroid: 'Instructions Android : 1. Touchez le fichier .vcf téléchargé. 2. Choisissez "Contacts" ou "Google Contacts". 3. Sélectionnez votre compte Google.',
    dlInstructionsIos: 'Instructions iPhone : 1. Ouvrez le fichier .vcf dans Fichiers ou Safari. 2. Touchez "Ajouter tous les contacts". 3. Ouvrez WhatsApp et glissez vers le bas pour actualiser.',
    dlSuccessToast: 'Fichier de démonstration .vcf téléchargé avec succès.',

    // Profile & Consent
    profileTitle: 'Profil, Confidentialité & Consentement',
    profileSubhead: 'Gérez votre visibilité, vos coordonnées et vos droits de participation.',
    consentActiveNotice: 'Vos coordonnées sont actuellement éligibles pour les prochaines diffusions hebdomadaires.',
    requestRemovalTitle: 'Demander le Retrait des Contacts',
    requestRemovalDesc: 'Retirez-vous de toutes les prochaines diffusions hebdomadaires. Votre numéro sera immédiatement exclu des futurs exports.',
    requestRemovalBtn: 'Révoquer le Consentement & Demander le Retrait',
    deactivateAccountTitle: 'Désactivation du Compte',
    deactivateAccountBtn: 'Désactiver le Compte',

    // Referrals & Help
    refTitle: 'Parrainages & Croissance',
    refDesc: 'Partagez votre code d\'invitation personnel avec d\'autres créateurs et professionnels.',
    faqTitle: 'Foire Aux Questions',
    supportTitle: 'Contacter le Support',
    abuseTitle: 'Signaler un Abus ou Spam',

    // Admin
    adminDashboardTitle: 'Console d\'Administration',
    adminNotice: 'Environnement Admin de Démonstration : Le contrôle d\'accès basé sur les rôles (RBAC) et la persistance réelle seront intégrés en Phase 2.',
    adminKpiTotal: 'Inscriptions Totales',
    adminKpiEligible: 'Éligibles au Partage',
    adminKpiCountries: 'Pays Représentés',
    adminKpiRemovals: 'Demandes de Retrait',
    adminKpiReports: 'Signalements d\'Abus',
    adminKpiThreshold: 'Progression Seuil Pilote',
  }
};
