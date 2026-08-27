import "dotenv/config";

import {
  PrismaClient,
  ContentStatus,
  Difficulty,
  MenuLocation,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { seedDev2Content } from "./seed-dev2";
import { seedSapiensOfficialContent } from "./seed-sapiens-official-content";
import { seedSapiensPagesEn } from "./seed-sapiens-pages-en";

const prisma = new PrismaClient();

const rich = (paragraphs: string[]) => ({
  type: "doc",
  content: paragraphs.map((text) => ({
    type: "paragraph",
    content: [{ type: "text", text }],
  })),
});

async function main() {
  const configuredAdminPassword = process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production" && !configuredAdminPassword) {
    throw new Error(
      "ADMIN_PASSWORD must be configured before seeding a production database.",
    );
  }
  const adminPassword = configuredAdminPassword ?? "ChangeMe!2026";
  const adminPasswordHash = await hash(adminPassword, 12);

  const permissions = [
    ["dashboard.view", "Consulter le tableau de bord"],
    ["content.manage", "Gérer tout le contenu"],
    ["blog.manage", "Gérer le blog"],
    ["requests.manage", "Gérer les demandes"],
    ["users.manage", "Gérer les utilisateurs"],
    ["settings.manage", "Gérer les paramètres"],
  ] as const;

  const role = await prisma.role.upsert({
    where: { name: "Administrateur" },
    update: {},
    create: {
      name: "Administrateur",
      description: "Accès complet à Sapiens IA",
    },
  });

  for (const [key, description] of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: { description },
      create: { key, description },
    });
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: role.id, permissionId: permission.id },
      },
      update: {},
      create: { roleId: role.id, permissionId: permission.id },
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@fancyvision.fr" },
    update: {
      roleId: role.id,
      ...(configuredAdminPassword ? { passwordHash: adminPasswordHash } : {}),
    },
    create: {
      name: "Admin Sapiens IA",
      email: "admin@fancyvision.fr",
      passwordHash: adminPasswordHash,
      roleId: role.id,
    },
  });

  const consulting = await prisma.serviceCategory.upsert({
    where: { slug: "conseil" },
    update: {},
    create: {
      name: "Cabinet de conseil",
      slug: "conseil",
      description: "De la stratégie au déploiement opérationnel.",
    },
  });

  const serviceSeed = [
    {
      title: "Audit des cas d’usage IA",
      slug: "audit-ia",
      excerpt:
        "Nous analysons vos processus métier et construisons une feuille de route IA claire, priorisée et mesurable.",
      icon: "scan-search",
      content: rich([
        "Un diagnostic complet de vos métiers, outils et données pour identifier les opportunités à fort impact.",
        "Vous repartez avec une feuille de route priorisée, des estimations de gains et un plan de déploiement responsable.",
      ]),
    },
    {
      title: "Conduite du changement",
      slug: "conduite-du-changement",
      excerpt:
        "Nous mobilisons vos équipes, structurons la gouvernance et ancrons durablement les nouveaux usages.",
      icon: "route",
      content: rich([
        "L’adoption est au cœur de chaque transformation réussie.",
        "Nos consultants animent votre communauté IA, suivent les usages et accélèrent la montée en compétences.",
      ]),
    },
    {
      title: "Développement IA sur mesure",
      slug: "developpement-sur-mesure",
      excerpt:
        "Agents, automatisations et copilotes intégrés à votre environnement pour résoudre vos vrais irritants métier.",
      icon: "sparkles",
      content: rich([
        "Nous concevons des solutions utiles, sécurisées et parfaitement intégrées à vos outils.",
        "Chaque prototype est testé sur le terrain avant industrialisation.",
      ]),
    },
    {
      title: "Gestion des licences IA",
      slug: "gestion-licences",
      excerpt:
        "Choix, paramétrage et déploiement sécurisé des meilleurs outils d’IA générative pour vos équipes.",
      icon: "key-round",
      content: rich([
        "Nous vous aidons à choisir et administrer ChatGPT Enterprise, Microsoft Copilot, Claude ou Mistral.",
        "La sécurité, la conformité et le pilotage des coûts sont intégrés dès le départ.",
      ]),
    },
  ];

  for (const [order, item] of serviceSeed.entries()) {
    await prisma.service.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: { ...item, order, status: ContentStatus.PUBLISHED },
      create: {
        ...item,
        categoryId: consulting.id,
        order,
        featured: true,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  const enterprise = await prisma.trainingCategory.upsert({
    where: { slug: "entreprise" },
    update: {},
    create: {
      name: "Formations en entreprise",
      slug: "entreprise",
      description: "Des programmes adaptés à vos équipes et vos métiers.",
      order: 0,
    },
  });
  const individual = await prisma.trainingCategory.upsert({
    where: { slug: "particuliers" },
    update: {},
    create: {
      name: "Formations individuelles",
      slug: "particuliers",
      description: "Développez une maîtrise pratique de l’IA à votre rythme.",
      order: 1,
    },
  });

  const trainingSeed = [
    {
      categoryId: enterprise.id,
      title: "IA Booster",
      slug: "ia-booster",
      excerpt:
        "Une journée immersive pour adopter les réflexes et outils essentiels.",
      duration: "1 journée",
      priceCents: null,
      objectives: [
        "Comprendre l’IA générative",
        "Maîtriser le prompt",
        "Créer ses premiers assistants",
      ],
      audience: ["Équipes opérationnelles", "Managers"],
    },
    {
      categoryId: enterprise.id,
      title: "IA Performer",
      slug: "ia-performer",
      excerpt:
        "Un parcours métier complet pour transformer durablement la productivité.",
      duration: "3 à 6 semaines",
      priceCents: null,
      objectives: [
        "Cartographier les usages",
        "Construire des workflows",
        "Mesurer les gains",
      ],
      audience: ["Équipes métier", "Référents IA"],
    },
    {
      categoryId: individual.id,
      title: "IA & Productivité",
      slug: "ia-productivite",
      excerpt:
        "Gagnez du temps chaque jour avec ChatGPT, Claude et les meilleurs outils.",
      duration: "14 heures",
      priceCents: 149000,
      objectives: [
        "Écrire plus vite",
        "Analyser ses documents",
        "Automatiser les tâches répétitives",
      ],
      audience: ["Indépendants", "Salariés", "Demandeurs d’emploi"],
    },
  ];

  for (const [order, item] of trainingSeed.entries()) {
    await prisma.training.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: { ...item, order, status: ContentStatus.PUBLISHED },
      create: {
        ...item,
        content: rich([
          "Une formation immédiatement applicable, conçue par des praticiens de l’IA.",
          "Exercices, cas métiers, support et ressources sont inclus.",
        ]),
        modules: [
          {
            title: "Comprendre",
            description: "Fondamentaux et cadre responsable",
          },
          {
            title: "Pratiquer",
            description: "Ateliers guidés sur vos cas réels",
          },
          { title: "Déployer", description: "Plan d’action et accompagnement" },
        ],
        difficulty: Difficulty.ALL_LEVELS,
        status: ContentStatus.PUBLISHED,
        featured: true,
        order,
        publishedAt: new Date(),
      },
    });
  }

  const category = await prisma.articleCategory.upsert({
    where: { slug: "guides-pratiques" },
    update: {},
    create: {
      name: "Guides pratiques",
      slug: "guides-pratiques",
      description: "Des méthodes concrètes pour mieux travailler avec l’IA.",
    },
  });
  const analysisCategory = await prisma.articleCategory.upsert({
    where: { slug: "etudes-analyses" },
    update: {},
    create: {
      name: "Études & analyses",
      slug: "etudes-analyses",
      description: "Décryptages et tendances de l’intelligence artificielle.",
    },
  });

  const articleSeed = [
    {
      title: "Sécuriser les usages de l’IA générative en entreprise",
      slug: "securiser-usages-ia-generative",
      excerpt:
        "Une méthode claire pour protéger les données, choisir les bons outils et construire une gouvernance pragmatique.",
      categoryId: analysisCategory.id,
      readingTime: 8,
    },
    {
      title: "7 automatisations IA qui font gagner du temps chaque semaine",
      slug: "automatisations-ia-productivite",
      excerpt:
        "Des cas d’usage accessibles pour transformer les comptes rendus, recherches, emails et analyses.",
      categoryId: category.id,
      readingTime: 6,
    },
    {
      title: "Du prompt au contexte : concevoir un assistant vraiment utile",
      slug: "prompt-contexte-assistant-ia",
      excerpt:
        "Pourquoi un bon assistant métier repose autant sur le contexte et les données que sur le modèle choisi.",
      categoryId: category.id,
      readingTime: 7,
    },
  ];

  for (const [index, item] of articleSeed.entries()) {
    await prisma.article.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: { ...item, status: ContentStatus.PUBLISHED },
      create: {
        ...item,
        authorId: admin.id,
        content: rich([
          "L’intelligence artificielle devient utile lorsqu’elle s’intègre avec précision aux méthodes de travail existantes.",
          "Commencez par un périmètre simple, mesurez les résultats, puis améliorez le dispositif avec les équipes concernées.",
          "Cette approche progressive permet de créer de la confiance tout en maîtrisant les risques et les investissements.",
        ]),
        coverImage: "/images/fancyvision-ai-strategy.webp",
        status: ContentStatus.PUBLISHED,
        featured: index === 0,
        publishedAt: new Date(Date.now() - index * 86400000 * 6),
      },
    });
  }

  const faqSeed = [
    [
      "Quelle est la meilleure manière de commencer avec l’IA générative ?",
      "Commencez par un diagnostic court de vos processus et de vos données. Il permet d’identifier les gains rapides, les risques et le niveau de formation nécessaire avant d’investir davantage.",
    ],
    [
      "Pouvez-vous former plusieurs centaines de collaborateurs ?",
      "Oui. Nous concevons des parcours multi-sites, segmentés par métier, avec formateurs, ambassadeurs internes, ressources pédagogiques et mesure d’adoption.",
    ],
    [
      "Combien de temps faut-il pour observer des résultats ?",
      "Les gains individuels apparaissent dès les premiers ateliers. Pour un déploiement d’entreprise, les premiers indicateurs significatifs sont généralement visibles en quatre à douze semaines.",
    ],
    [
      "Comment protégez-vous les données sensibles ?",
      "Chaque mission intègre une analyse des outils, des flux de données et des droits d’accès. Nous privilégions les environnements professionnels configurés selon vos contraintes SI et RGPD.",
    ],
  ];
  for (const [order, [question, answer]] of faqSeed.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question } });
    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: { answer, order },
      });
    } else {
      await prisma.faq.create({
        data: { category: "Général", question, answer, order, visible: true },
      });
    }
  }

  const home = await prisma.page.upsert({
    where: { locale_slug: { locale: "fr", slug: "accueil" } },
    update: {
      title: "Cabinet de conseil et organisme de formation en IA",
      status: ContentStatus.PUBLISHED,
    },
    create: {
      title: "Cabinet de conseil et organisme de formation en IA",
      slug: "accueil",
      eyebrow: "Conseil · Formation · Déploiement",
      headline: "L’IA utile, adoptée par vos équipes.",
      description:
        "Sapiens IA aide les organisations et les professionnels à transformer l’intelligence artificielle en résultats concrets.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });
  await prisma.section.deleteMany({ where: { pageId: home.id } });
  await prisma.section.createMany({
    data: [
      {
        pageId: home.id,
        name: "Hero",
        type: "hero",
        order: 0,
        data: {
          eyebrow: "Cabinet de conseil & organisme de formation",
          title: "Cabinet de conseil\net organisme de formation en IA",
          description:
            "Nous aidons les entreprises, les administrations et les professionnels à intégrer l’IA générative dans leur quotidien, de la stratégie à l’usage.",
          primaryLabel: "Échangeons sur votre projet",
          primaryHref: "/rendez-vous",
        },
      },
      {
        pageId: home.id,
        name: "Références",
        type: "logos",
        order: 1,
        data: {
          title: "Ils nous font confiance",
          logos: [
            "NOVA",
            "AXIOME",
            "ORBE",
            "HORIZON",
            "ATLAS",
            "PULSE",
            "NEXUS",
            "CÉLÈSTE",
          ],
        },
      },
      {
        pageId: home.id,
        name: "Introduction conseil",
        type: "services-intro",
        order: 2,
        data: {
          eyebrow: "Cabinet de conseil",
          title: "Nos services\nde conseil en IA",
        },
      },
      {
        pageId: home.id,
        name: "Formation entreprise",
        type: "split-feature",
        order: 3,
        data: {
          eyebrow: "Formation en entreprise",
          title: "Formations en entreprise des professionnels à l’IA",
          description:
            "De la sensibilisation du Comex aux ateliers métier, nos programmes sur mesure créent une montée en compétence immédiate et mesurable.",
          ctaLabel: "Découvrir les formations",
          ctaHref: "/formation",
          image: "/images/fancyvision-ai-strategy.webp",
        },
      },
      {
        pageId: home.id,
        name: "Formation particuliers",
        type: "split-feature",
        order: 4,
        data: {
          eyebrow: "Formation pour particulier",
          title: "Se former à l’IA en tant que particulier",
          description:
            "Maîtrisez l’IA générative à votre rythme avec nos formations dédiées aux indépendants et particuliers. Sessions collectives ou coaching individuel : nous vous accompagnons pour exploiter pleinement les meilleurs outils.",
          ctaLabel: "Développez vos compétences en IA",
          ctaHref: "/formation",
          image: "/images/fancyvision-ai-strategy.webp",
          reverse: true,
        },
      },
      {
        pageId: home.id,
        name: "CTA formations",
        type: "cta",
        order: 5,
        data: {
          title: "Vous êtes intéressé par l’une de nos formations ?",
          description:
            "Planifiez un appel avec un de nos consultants. Obtenez un diagnostic de vos besoins et des recommandations concrètes pour implémenter l’IA dans vos processus.",
          ctaLabel: "Échanger avec nous",
          ctaHref: "/rendez-vous",
        },
      },
      {
        pageId: home.id,
        name: "Avantages",
        type: "advantages",
        order: 6,
        data: {
          eyebrow: "Pourquoi Sapiens IA",
          title: "Une double expertise qui produit des résultats.",
          items: [
            {
              number: "01",
              title: "Conseil & formation",
              description:
                "Les recommandations sont conçues avec ceux qui les utiliseront, puis transformées en nouveaux réflexes.",
              stats: [
                { value: "Agile", label: "méthode de travail" },
                { value: "9,6/10", label: "de satisfaction" },
              ],
            },
            {
              number: "02",
              title: "Expertise française",
              description:
                "Une équipe pluridisciplinaire proche de vos enjeux, attentive à la sécurité et au cadre européen.",
              stats: [
                { value: "40+", label: "experts mobilisables" },
                { value: "120", label: "cas d’usage déployés" },
              ],
            },
            {
              number: "03",
              title: "Impact mesurable",
              description:
                "Chaque intervention définit ses indicateurs et organise la mesure des gains dans la durée.",
              stats: [
                { value: "25 %", label: "de temps gagné en moyenne" },
                { value: "90 j", label: "pour industrialiser" },
              ],
            },
          ],
        },
      },
      {
        pageId: home.id,
        name: "Méthode",
        type: "process",
        order: 7,
        data: {
          eyebrow: "Notre méthode",
          title: "Une trajectoire claire,\ndu besoin à l’impact.",
          steps: [
            "Diagnostic de vos besoins concrets",
            "Priorisation des opportunités",
            "Déploiement, formation et adoption",
            "Mesure et amélioration continue",
          ],
        },
      },
      {
        pageId: home.id,
        name: "CTA expertises",
        type: "cta",
        order: 8,
        data: {
          title: "Vous êtes intéressé par l’une de nos expertises ?",
          description:
            "Planifiez un appel avec un de nos consultants. Obtenez un diagnostic de vos besoins et des recommandations concrètes pour implémenter l’IA dans vos processus.",
          ctaLabel: "Échanger avec nous",
          ctaHref: "/rendez-vous",
        },
      },
      {
        pageId: home.id,
        name: "Le cabinet",
        type: "about",
        order: 9,
        data: {
          eyebrow: "Le cabinet",
          title: "Une équipe dédiée à rendre l’IA accessible et utile.",
          description:
            "Nous croyons à une intelligence artificielle pragmatique, responsable et au service des équipes, de la direction aux collaborateurs de terrain.",
          ctaLabel: "Découvrir le cabinet",
          ctaHref: "/a-propos",
          image: "/images/fancyvision-ai-strategy.webp",
        },
      },
    ],
  });

  const simplePages = [
    {
      slug: "services",
      title: "Conseil en intelligence artificielle",
      headline: "De l’ambition IA aux résultats métier.",
      description:
        "Audit, gouvernance, développement et adoption : nous assemblons le bon dispositif pour votre organisation.",
    },
    {
      slug: "formation",
      title: "Formations en intelligence artificielle",
      headline: "Apprendre aujourd’hui. Transformer demain.",
      description:
        "Des formations pratiques, adaptées aux métiers et conçues pour une adoption durable.",
    },
    {
      slug: "a-propos",
      title: "À propos de Sapiens IA",
      headline: "Nous mettons l’humain au centre de l’IA.",
      description:
        "Un collectif de consultants, formateurs et builders réuni autour d’une conviction : la technologie n’a d’impact que lorsqu’elle est vraiment adoptée.",
    },
    {
      slug: "etudes-de-cas",
      title: "Études de cas",
      headline: "Des projets IA qui changent le quotidien.",
      description:
        "Découvrez comment nos clients structurent, déploient et mesurent leurs usages de l’intelligence artificielle.",
    },
    {
      slug: "blog",
      title: "Le blog Sapiens IA",
      headline: "Actualités, opinions et méthodes.",
      description:
        "Des analyses de fond et des guides pratiques pour comprendre et exploiter l’IA au travail.",
    },
    {
      slug: "contact",
      title: "Contact",
      headline: "Parlons de votre projet.",
      description:
        "Décrivez-nous votre contexte. Un consultant vous répond sous un jour ouvré.",
    },
  ];
  for (const item of simplePages) {
    await prisma.page.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: { ...item, status: ContentStatus.PUBLISHED },
      create: {
        ...item,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  const legalPages = [
    {
      slug: "mentions-legales",
      title: "Mentions légales",
      description:
        "Informations relatives à l’éditeur et à l’hébergement du site Sapiens IA.",
      paragraphs: [
        "Éditeur : Sapiens IA, société de conseil et de formation en intelligence artificielle. Siège social : Casablanca, Maroc. Contact : voir notre formulaire de contact.",
        "Le site est hébergé par Vercel Inc. Les contenus, marques, illustrations et éléments graphiques sont protégés. Toute reproduction non autorisée est interdite.",
        "Sapiens IA s’efforce de fournir des informations exactes et à jour, sans pouvoir garantir l’absence complète d’erreurs.",
      ],
    },
    {
      slug: "confidentialite",
      title: "Politique de confidentialité",
      description:
        "Comment Sapiens IA collecte, utilise et protège vos données personnelles.",
      paragraphs: [
        "Les données transmises via les formulaires sont utilisées uniquement pour répondre à votre demande ou gérer un rendez-vous.",
        "La base légale dépend du service concerné : consentement, mesures précontractuelles ou intérêt légitime. Les données ne sont pas revendues.",
        "Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos données via notre formulaire de contact.",
      ],
    },
    {
      slug: "conditions",
      title: "Conditions d’utilisation",
      description:
        "Les règles d’accès et d’utilisation des services numériques Sapiens IA.",
      paragraphs: [
        "L’accès au site implique l’acceptation des présentes conditions. Les informations publiées ont une vocation générale et ne constituent pas un conseil juridique ou financier.",
        "L’utilisateur s’engage à ne pas perturber le fonctionnement du site, détourner ses formulaires ou tenter d’accéder à des espaces protégés.",
        "Sapiens IA peut faire évoluer le site et ces conditions à tout moment. Le droit français est applicable.",
      ],
    },
  ];
  for (const legal of legalPages) {
    const page = await prisma.page.upsert({
      where: { locale_slug: { locale: "fr", slug: legal.slug } },
      update: {
        title: legal.title,
        description: legal.description,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: legal.slug,
        title: legal.title,
        headline: legal.title,
        description: legal.description,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
    const section = await prisma.section.findFirst({
      where: { pageId: page.id, type: "legal" },
    });
    if (section) {
      await prisma.section.update({
        where: { id: section.id },
        data: { data: { body: rich(legal.paragraphs) } },
      });
    } else {
      await prisma.section.create({
        data: {
          pageId: page.id,
          name: "Contenu légal",
          type: "legal",
          data: { body: rich(legal.paragraphs) },
        },
      });
    }
  }

  // Doit s'exécuter après les boucles simplePages/legalPages ci-dessus :
  // consolide en base la traduction anglaise de ces 8 pages, déjà validée
  // (voir audit consolidé). N'écrit jamais sur les pages FR.
  await seedSapiensPagesEn(prisma);

  for (const [key, value, group] of [
    [
      "company",
      {
        name: "Sapiens IA",
        email: "contact@sapiens-ia.com",
        // Téléphone marocain définitif en attente de confirmation par le
        // client : ne pas remplacer par un numéro inventé (voir audit PDF).
        phone: "+33 1 84 80 20 26",
        address: "Casablanca, Maroc",
        linkedin: "https://www.linkedin.com",
      },
      "general",
    ],
    [
      "site",
      {
        logo: "Sapiens IA",
        tagline: "L’IA utile, adoptée par vos équipes.",
        defaultOgImage: "/images/fancyvision-ai-strategy.webp",
      },
      "branding",
    ],
    [
      "cookie",
      {
        enabled: true,
        text: "Nous utilisons des cookies essentiels et, avec votre accord, des mesures d’audience.",
      },
      "legal",
    ],
  ] as const) {
    await prisma.setting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group },
    });
  }

  const header = await prisma.menu.upsert({
    where: { location_locale: { location: MenuLocation.HEADER, locale: "fr" } },
    update: { name: "Navigation principale" },
    create: { name: "Navigation principale", location: MenuLocation.HEADER },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: header.id } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: header.id, label: "Conseil", url: "/services", order: 0 },
      { menuId: header.id, label: "Formation", url: "/formation", order: 1 },
      {
        menuId: header.id,
        label: "Cas clients",
        url: "/etudes-de-cas",
        order: 2,
      },
      { menuId: header.id, label: "Le cabinet", url: "/a-propos", order: 3 },
      { menuId: header.id, label: "Le blog", url: "/blog", order: 4 },
    ],
  });

  const footer = await prisma.menu.upsert({
    where: { location_locale: { location: MenuLocation.FOOTER, locale: "fr" } },
    update: { name: "Navigation pied de page" },
    create: { name: "Navigation pied de page", location: MenuLocation.FOOTER },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: footer.id } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footer.id, label: "Services", url: "/services", order: 0 },
      { menuId: footer.id, label: "Formations", url: "/formation", order: 1 },
      { menuId: footer.id, label: "À propos", url: "/a-propos", order: 2 },
      { menuId: footer.id, label: "Blog", url: "/blog", order: 3 },
      { menuId: footer.id, label: "Contact", url: "/contact", order: 4 },
      {
        menuId: footer.id,
        label: "Mentions légales",
        url: "/mentions-legales",
        order: 5,
      },
      {
        menuId: footer.id,
        label: "Confidentialité",
        url: "/confidentialite",
        order: 6,
      },
    ],
  });

  console.info("Sapiens IA seed terminé.");
  await seedDev2Content(prisma, admin.id);
  // Doit s'exécuter après seedDev2Content : celui-ci archive tout Service/
  // Training FR absent de ses propres listes, ce qui écraserait ce contenu
  // s'il était semé avant.
  await seedSapiensOfficialContent(prisma);
  console.info("Compte administrateur initialisé: admin@fancyvision.fr");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
