import {
  ContentStatus,
  Difficulty,
  MenuLocation,
  Prisma,
  type PrismaClient,
} from "@prisma/client";

import {
  dev2ArticleCategories,
  dev2Articles,
  dev2Assets,
  dev2Cities,
  dev2Events,
  dev2Faq,
  dev2Services,
  dev2Trainings,
} from "../lib/content/dev2";

const paragraph = (text: string) => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});

const heading = (text: string, level = 2) => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

const bulletList = (items: readonly string[]) => ({
  type: "bulletList",
  content: items.map((text) => ({
    type: "listItem",
    content: [paragraph(text)],
  })),
});

const rich = (...content: Array<Record<string, unknown>>) =>
  ({
    type: "doc",
    content,
  }) as Prisma.InputJsonObject;

const categorySlugByName = new Map(
  dev2ArticleCategories.map(([slug, name]) => [name, slug]),
);

export async function seedDev2Content(prisma: PrismaClient, adminId: string) {
  const now = new Date();

  const serviceCategories = {
    conseil: await prisma.serviceCategory.upsert({
      where: { slug: "conseil" },
      update: {
        name: "Conseil",
        description:
          "De l’audit au déploiement, un accompagnement opérationnel pour vos projets d’intelligence artificielle.",
        order: 0,
      },
      create: {
        slug: "conseil",
        name: "Conseil",
        description:
          "De l’audit au déploiement, un accompagnement opérationnel pour vos projets d’intelligence artificielle.",
        order: 0,
      },
    }),
    data: await prisma.serviceCategory.upsert({
      where: { slug: "data" },
      update: {
        name: "Data",
        description:
          "Des fondations Data fiables et des produits qui transforment vos données en décisions.",
        order: 1,
      },
      create: {
        slug: "data",
        name: "Data",
        description:
          "Des fondations Data fiables et des produits qui transforment vos données en décisions.",
        order: 1,
      },
    }),
  };

  const serviceIds = new Map<string, string>();
  for (const [order, item] of dev2Services.entries()) {
    const service = await prisma.service.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: {
        categoryId: serviceCategories[item.category].id,
        title: item.title,
        excerpt: item.description,
        content: rich(
          heading(item.headline),
          paragraph(item.description),
          heading("Ce que comprend l’accompagnement", 3),
          bulletList(item.features),
          paragraph(
            "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.",
          ),
        ),
        image: item.image,
        order,
        featured: true,
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
      create: {
        locale: "fr",
        categoryId: serviceCategories[item.category].id,
        title: item.title,
        slug: item.slug,
        excerpt: item.description,
        content: rich(
          heading(item.headline),
          paragraph(item.description),
          heading("Ce que comprend l’accompagnement", 3),
          bulletList(item.features),
          paragraph(
            "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.",
          ),
        ),
        image: item.image,
        order,
        featured: true,
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
    });
    serviceIds.set(item.slug, service.id);
  }

  await prisma.service.updateMany({
    where: {
      locale: "fr",
      slug: { notIn: dev2Services.map((item) => item.slug) },
    },
    data: { status: ContentStatus.ARCHIVED, featured: false },
  });

  const trainingCategories = {
    entreprise: await prisma.trainingCategory.upsert({
      where: { slug: "entreprise" },
      update: {
        name: "Formation en entreprise",
        description:
          "Des parcours par niveau et par métier, partout en France ou à distance.",
        order: 0,
      },
      create: {
        slug: "entreprise",
        name: "Formation en entreprise",
        description:
          "Des parcours par niveau et par métier, partout en France ou à distance.",
        order: 0,
      },
    }),
    particuliers: await prisma.trainingCategory.upsert({
      where: { slug: "particuliers" },
      update: {
        name: "Formation pour particuliers",
        description:
          "Des formations pratiques et des ateliers en ligne pour développer vos compétences.",
        order: 1,
      },
      create: {
        slug: "particuliers",
        name: "Formation pour particuliers",
        description:
          "Des formations pratiques et des ateliers en ligne pour développer vos compétences.",
        order: 1,
      },
    }),
  };

  for (const [order, item] of dev2Trainings.entries()) {
    const difficulty =
      item.level === "Débutant"
        ? Difficulty.BEGINNER
        : item.level === "Avancé"
          ? Difficulty.ADVANCED
          : Difficulty.ALL_LEVELS;
    const objectives = [
      "Comprendre les modèles et leurs limites",
      "Structurer de meilleurs prompts",
      "Appliquer l’IA à des situations métier réelles",
      "Adopter les bonnes pratiques de sécurité",
    ];
    const modules = [
      {
        title: "Diagnostic",
        description: "Identifier les besoins et le niveau des participants.",
      },
      {
        title: "Démonstrations métier",
        description:
          "Découvrir les usages les plus utiles dans votre contexte.",
      },
      {
        title: "Exercices pratiques",
        description: "S’entraîner sur des cas concrets avec les outils d’IA.",
      },
      {
        title: "Ressources & suivi",
        description: "Repartir avec des supports et un plan de progression.",
      },
    ];
    await prisma.training.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: {
        categoryId: trainingCategories[item.category].id,
        title: item.title,
        excerpt: item.description,
        content: rich(
          heading(item.headline),
          paragraph(item.description),
          paragraph(
            "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.",
          ),
        ),
        objectives,
        audience: [item.audience],
        modules,
        duration: item.duration,
        image: item.image,
        difficulty,
        featured: true,
        order,
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
      create: {
        locale: "fr",
        categoryId: trainingCategories[item.category].id,
        title: item.title,
        slug: item.slug,
        excerpt: item.description,
        content: rich(
          heading(item.headline),
          paragraph(item.description),
          paragraph(
            "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.",
          ),
        ),
        objectives,
        audience: [item.audience],
        modules,
        duration: item.duration,
        image: item.image,
        difficulty,
        featured: true,
        order,
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
    });
  }

  await prisma.training.updateMany({
    where: {
      locale: "fr",
      slug: { notIn: dev2Trainings.map((item) => item.slug) },
    },
    data: { status: ContentStatus.ARCHIVED, featured: false },
  });

  const articleCategoryIds = new Map<string, string>();
  for (const [slug, name] of dev2ArticleCategories) {
    const category = await prisma.articleCategory.upsert({
      where: { slug },
      update: {
        name,
        description: `Articles, méthodes et analyses Sapiens IA sur le thème « ${name} ».`,
      },
      create: {
        slug,
        name,
        description: `Articles, méthodes et analyses Sapiens IA sur le thème « ${name} ».`,
      },
    });
    articleCategoryIds.set(slug, category.id);
  }

  for (const [index, [slug, title, categoryName]] of dev2Articles.entries()) {
    const categorySlug = categorySlugByName.get(categoryName);
    const categoryId = categorySlug
      ? articleCategoryIds.get(categorySlug)
      : undefined;
    const image = [
      dev2Assets.audit,
      dev2Assets.change,
      dev2Assets.custom,
      dev2Assets.training,
    ][index % 4];
    const excerpt = `${title} : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.`;
    const content = rich(
      paragraph(
        "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.",
      ),
      heading("Commencer par un objectif concret"),
      paragraph(
        "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.",
      ),
      heading("Adopter une méthode simple"),
      bulletList([
        "Choisir un cas d’usage précis et fréquent",
        "Tester avec des données non sensibles",
        "Comparer le résultat à votre méthode actuelle",
        "Documenter les prompts et les bonnes pratiques",
      ]),
      heading("Garder l’humain dans la boucle"),
      paragraph(
        "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.",
      ),
    );
    await prisma.article.upsert({
      where: { locale_slug: { locale: "fr", slug } },
      update: {
        title,
        excerpt,
        categoryId,
        authorId: adminId,
        content,
        coverImage: image,
        readingTime: 6,
        featured: index < 3,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(now.getTime() - index * 3 * 86_400_000),
      },
      create: {
        locale: "fr",
        slug,
        title,
        excerpt,
        categoryId,
        authorId: adminId,
        content,
        coverImage: image,
        readingTime: 6,
        featured: index < 3,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(now.getTime() - index * 3 * 86_400_000),
      },
    });
  }

  await prisma.article.deleteMany({
    where: {
      locale: "fr",
      slug: { notIn: dev2Articles.map(([slug]) => slug) },
    },
  });

  // A new company should not present borrowed clients, team members, or testimonials.
  await prisma.caseStudy.deleteMany({ where: { locale: "fr" } });
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();

  await prisma.faq.updateMany({ data: { visible: false } });
  for (const [order, [question, answer]] of dev2Faq.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question } });
    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: {
          category: "Général",
          answer,
          order,
          visible: true,
        },
      });
    } else {
      await prisma.faq.create({
        data: {
          category: "Général",
          question,
          answer,
          order,
          visible: true,
        },
      });
    }
  }

  const home = await prisma.page.upsert({
    where: { locale_slug: { locale: "fr", slug: "accueil" } },
    update: {
      title: "Conseil, formation et intégration en intelligence artificielle",
      eyebrow: "Conseil · Formation · Intégration",
      headline: "Donnez une vision claire à vos projets d’IA",
      description:
        "Sapiens IA aide les entreprises, administrations et professionnels à transformer l’intelligence artificielle en usages concrets.",
      status: ContentStatus.PUBLISHED,
      publishedAt: now,
    },
    create: {
      locale: "fr",
      slug: "accueil",
      title: "Conseil, formation et intégration en intelligence artificielle",
      eyebrow: "Conseil · Formation · Intégration",
      headline: "Donnez une vision claire à vos projets d’IA",
      description:
        "Sapiens IA aide les entreprises, administrations et professionnels à transformer l’intelligence artificielle en usages concrets.",
      status: ContentStatus.PUBLISHED,
      publishedAt: now,
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
          eyebrow: "Conseil · Formation · Intégration",
          title: "Donnez une vision claire\nà vos projets d’IA",
          description:
            "Sapiens IA aide les entreprises, administrations et professionnels à transformer l’intelligence artificielle en usages concrets.",
          primaryLabel: "Échangeons sur votre projet",
          primaryHref: "/rendez-vous",
          secondaryLabel: "Voir les prochaines sessions",
          secondaryHref: "/evenements",
        },
      },
      {
        pageId: home.id,
        name: "Conseil",
        type: "services-intro",
        order: 2,
        data: {
          eyebrow: "Conseil",
          title: "Des projets d’IA\nclairs et activables",
          categorySlug: "conseil",
          image: dev2Assets.audit,
        },
      },
      {
        pageId: home.id,
        name: "Data",
        type: "services-intro",
        order: 3,
        data: {
          eyebrow: "Data",
          title: "Des données fiables,\nutiles et activables",
          description:
            "De la stratégie à la Data Science, Sapiens IA construit les fondations et les produits qui transforment vos données en décisions.",
          categorySlug: "data",
          image: dev2Assets.custom,
        },
      },
      {
        pageId: home.id,
        name: "Formation entreprise",
        type: "split-feature",
        order: 4,
        data: {
          eyebrow: "Formation en entreprise",
          title: "Faites grandir les usages dans vos équipes",
          description:
            "Des programmes par métier, du COMEX aux équipes opérationnelles, conçus autour de situations réelles.",
          ctaLabel: "Découvrir les formations",
          ctaHref: "/formations",
          image: dev2Assets.training,
        },
      },
      {
        pageId: home.id,
        name: "Formation particuliers",
        type: "split-feature",
        order: 5,
        data: {
          eyebrow: "Formation pour particuliers",
          title: "Développez vos compétences en IA",
          description:
            "Des formations pratiques, des ateliers en ligne et un calendrier de sessions pour apprendre en faisant.",
          ctaLabel: "Voir les programmes",
          ctaHref: "/formations",
          image: dev2Assets.custom,
          reverse: true,
        },
      },
      {
        pageId: home.id,
        name: "Impact",
        type: "advantages",
        order: 6,
        data: {
          eyebrow: "Notre approche",
          title: "Une méthode simple, lisible et adaptée à votre contexte.",
          items: [
            {
              number: "01",
              title: "Cadrage",
              description:
                "Nous clarifions le besoin, les contraintes et les critères de réussite avant de construire.",
              stats: [
                { value: "01", label: "diagnostic" },
                { value: "Clair", label: "périmètre" },
              ],
            },
            {
              number: "02",
              title: "Mise en œuvre",
              description:
                "Nous avançons par itérations courtes avec des livrables concrets et faciles à tester.",
              stats: [
                { value: "02", label: "prototype" },
                { value: "Agile", label: "itérations" },
              ],
            },
            {
              number: "03",
              title: "Sur mesure",
              description:
                "Conseil, formation et intégration réunis dans un même parcours, adapté à votre maturité.",
              stats: [
                { value: "03", label: "déploiement" },
                { value: "Continu", label: "suivi" },
              ],
            },
          ],
        },
      },
      {
        pageId: home.id,
        name: "Agenda",
        type: "events-preview",
        order: 7,
        data: {
          eyebrow: "Agenda",
          title: "Les prochaines sessions Sapiens IA",
          description:
            "Formations, ateliers et rencontres pour apprendre, pratiquer et échanger avec nos experts.",
          items: dev2Events,
        },
      },
      {
        pageId: home.id,
        name: "Méthode",
        type: "process",
        order: 8,
        data: {
          eyebrow: "Notre méthode",
          title: "Du diagnostic à\nl’amélioration continue",
          steps: [
            "Diagnostic des besoins",
            "Choix du service adapté",
            "Déploiement opérationnel",
            "Mesure et optimisation",
          ],
        },
      },
      {
        pageId: home.id,
        name: "CTA",
        type: "cta",
        order: 9,
        data: {
          title: "Vous avez un projet IA ?",
          description:
            "Planifiez un échange avec nos consultants et obtenez une démarche adaptée à votre organisation.",
          ctaLabel: "Planifier un appel",
          ctaHref: "/rendez-vous",
        },
      },
      {
        pageId: home.id,
        name: "Le cabinet",
        type: "about",
        order: 10,
        data: {
          eyebrow: "À propos",
          title: "Rendre l’IA accessible, utile et responsable",
          description:
            "Sapiens IA réunit consultants, formateurs et experts produit pour relier la stratégie aux usages du quotidien.",
          ctaLabel: "Découvrir Sapiens IA",
          ctaHref: "/a-propos",
          image: dev2Assets.hero,
        },
      },
    ],
  });

  const pages = [
    {
      slug: "services",
      title: "Conseil & Data",
      headline: "Transformez vos ambitions en usages concrets.",
      description:
        "Audit, gouvernance, intégration, Data Engineering, Business Intelligence et Data Science : choisissez l’accompagnement adapté.",
    },
    {
      slug: "formation",
      title: "Formations en intelligence artificielle",
      headline: "Formez vos équipes à l’IA.",
      description:
        "Des parcours par niveau et par métier, conçus autour de situations réelles, partout en France ou à distance.",
    },
    {
      slug: "a-propos",
      title: "À propos de Sapiens IA",
      headline: "Rendre l’IA accessible, utile et responsable.",
      description:
        "Sapiens IA réunit consultants, formateurs et experts produit pour accompagner les organisations de la compréhension au déploiement.",
    },
    {
      slug: "etudes-de-cas",
      title: "Études de cas",
      headline: "Des transformations visibles sur le terrain.",
      description:
        "Découvrez comment nos clients structurent leurs usages, forment leurs équipes et mesurent les résultats.",
    },
    {
      slug: "blog",
      title: "Le média Sapiens IA",
      headline: "Actualités et opinions sur l’IA.",
      description:
        "Guides pratiques, analyses et méthodes pour passer de la curiosité à l’usage.",
    },
    {
      slug: "evenements",
      title: "Événements",
      headline: "Formations, ateliers et événements IA.",
      description:
        "Un calendrier unique pour apprendre, rencontrer nos experts et réserver votre prochaine session.",
    },
    {
      slug: "contact",
      title: "Contact",
      headline: "Parlons de votre projet.",
      description:
        "Décrivez-nous votre contexte. Un consultant vous répond sous un jour ouvré.",
    },
  ];
  for (const item of pages) {
    await prisma.page.upsert({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
      update: { ...item, status: ContentStatus.PUBLISHED, publishedAt: now },
      create: {
        locale: "fr",
        ...item,
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
    });
  }

  const legalPage = await prisma.page.upsert({
    where: { locale_slug: { locale: "fr", slug: "mentions-legales" } },
    update: {
      title: "Mentions légales & confidentialité",
      headline: "Mentions légales & confidentialité",
      description:
        "Informations légales, traitement des données personnelles et propriété intellectuelle.",
      status: ContentStatus.PUBLISHED,
      publishedAt: now,
    },
    create: {
      locale: "fr",
      slug: "mentions-legales",
      title: "Mentions légales & confidentialité",
      headline: "Mentions légales & confidentialité",
      description:
        "Informations légales, traitement des données personnelles et propriété intellectuelle.",
      status: ContentStatus.PUBLISHED,
      publishedAt: now,
    },
  });
  await prisma.section.deleteMany({
    where: { pageId: legalPage.id, type: "legal" },
  });
  await prisma.section.create({
    data: {
      pageId: legalPage.id,
      name: "Contenu légal",
      type: "legal",
      data: {
        body: rich(
          heading("Éditeur"),
          paragraph(
            "Sapiens IA présente ses activités de conseil et de formation en intelligence artificielle.",
          ),
          heading("Données personnelles"),
          paragraph(
            "Les données communiquées sont utilisées pour répondre aux demandes et gérer la relation commerciale.",
          ),
          heading("Vos droits"),
          paragraph(
            "Vous pouvez demander l’accès, la rectification ou l’effacement de vos données via notre formulaire de contact.",
          ),
          heading("Propriété intellectuelle"),
          paragraph(
            "Les marques, textes, visuels et éléments graphiques restent protégés par les droits de leurs titulaires.",
          ),
        ),
      },
    },
  });

  for (const [slug, city] of dev2Cities) {
    await prisma.page.upsert({
      where: {
        locale_slug: { locale: "fr", slug: `formation-ia-${slug}` },
      },
      update: {
        title: `Formation IA à ${city}`,
        headline: `Formation IA et ChatGPT à ${city}`,
        description:
          "Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.",
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
      create: {
        locale: "fr",
        slug: `formation-ia-${slug}`,
        title: `Formation IA à ${city}`,
        headline: `Formation IA et ChatGPT à ${city}`,
        description:
          "Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.",
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
      },
    });
  }

  for (const event of dev2Events) {
    const startAt = new Date(now);
    startAt.setDate(startAt.getDate() + event.offsetDays);
    startAt.setHours(event.hour, 0, 0, 0);
    const endAt = new Date(startAt.getTime() + 2 * 60 * 60 * 1000);
    const description =
      event.audience === "Entreprise"
        ? "Une session concrète pour découvrir les usages, méthodes et outils qui permettent de déployer l’IA dans votre organisation."
        : "Un atelier accessible et pratique pour découvrir de nouveaux usages de l’IA, poser vos questions et progresser avec nos experts.";

    await prisma.event.upsert({
      where: { slug: event.id },
      update: {
        title: event.title,
        description,
        type: event.type,
        audience: event.audience,
        location: event.location,
        host: event.host,
        startAt,
        endAt,
        image: event.image,
        capacity: 30,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: event.id,
        title: event.title,
        description,
        type: event.type,
        audience: event.audience,
        location: event.location,
        host: event.host,
        startAt,
        endAt,
        image: event.image,
        capacity: 30,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "company" },
    update: {
      group: "general",
      value: {
        name: "Sapiens IA",
        email: "contact@sapiens-ia.com",
        // Téléphone marocain définitif en attente de confirmation par le
        // client : ne pas remplacer par un numéro inventé (voir audit PDF).
        phone: "07 56 28 77 92",
        address: "Casablanca, Maroc",
        linkedin: "https://www.linkedin.com",
      },
    },
    create: {
      key: "company",
      group: "general",
      value: {
        name: "Sapiens IA",
        email: "contact@sapiens-ia.com",
        phone: "07 56 28 77 92",
        address: "Casablanca, Maroc",
        linkedin: "https://www.linkedin.com",
      },
    },
  });

  await prisma.setting.upsert({
    where: { key: "site" },
    update: {
      group: "branding",
      value: {
        logo: "Sapiens IA",
        tagline:
          "Conseil, formation et intégration de l’intelligence artificielle.",
        defaultOgImage: dev2Assets.og,
      },
    },
    create: {
      key: "site",
      group: "branding",
      value: {
        logo: "Sapiens IA",
        tagline:
          "Conseil, formation et intégration de l’intelligence artificielle.",
        defaultOgImage: dev2Assets.og,
      },
    },
  });

  const header = await prisma.menu.upsert({
    where: { location_locale: { location: MenuLocation.HEADER, locale: "fr" } },
    update: { name: "Navigation principale" },
    create: {
      name: "Navigation principale",
      location: MenuLocation.HEADER,
      locale: "fr",
    },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: header.id } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: header.id, label: "Nos services", url: "/services", order: 0 },
      { menuId: header.id, label: "Formation", url: "/formations", order: 1 },
      { menuId: header.id, label: "Événements", url: "/evenements", order: 2 },
      { menuId: header.id, label: "À propos", url: "/a-propos", order: 3 },
    ],
  });

  const footer = await prisma.menu.upsert({
    where: { location_locale: { location: MenuLocation.FOOTER, locale: "fr" } },
    update: { name: "Navigation pied de page" },
    create: {
      name: "Navigation pied de page",
      location: MenuLocation.FOOTER,
      locale: "fr",
    },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: footer.id } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footer.id, label: "Services", url: "/services", order: 0 },
      { menuId: footer.id, label: "Formations", url: "/formations", order: 1 },
      { menuId: footer.id, label: "Événements", url: "/evenements", order: 2 },
      { menuId: footer.id, label: "À propos", url: "/a-propos", order: 3 },
      { menuId: footer.id, label: "Contact", url: "/contact", order: 4 },
      {
        menuId: footer.id,
        label: "Mentions légales",
        url: "/mentions-legales",
        order: 6,
      },
      {
        menuId: footer.id,
        label: "Confidentialité",
        url: "/confidentialite",
        order: 7,
      },
    ],
  });
}
