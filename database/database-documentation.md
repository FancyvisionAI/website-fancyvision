# FancyVision Database Documentation

## Executive summary

This package documents the existing PostgreSQL relational database exactly as defined by `prisma/schema.prisma` and the SQL migration history under `prisma/migrations`. It is documentation only: no database objects or data were changed.

| Metric                       | Count |
| ---------------------------- | ----: |
| Tables                       |    35 |
| Physical columns             |   308 |
| Foreign keys                 |    25 |
| Enums                        |     5 |
| Explicit non-primary indexes |    20 |
| Domain groups                |     6 |

The physical design uses quoted PascalCase table names and mostly camelCase columns. Authentication, CMS content, commercial offerings, publishing, engagement, events, and audit/analytics concerns are kept in distinct table groups.

## Source and scope

- Database engine: PostgreSQL.
- ORM/schema source: Prisma.
- Authoritative files reviewed: `prisma/schema.prisma`, `prisma/migrations/0001_init/migration.sql`, and `prisma/migrations/0002_events/migration.sql`.
- Scope: tables, columns, data types, nullability, defaults, primary keys, unique constraints, indexes, foreign keys, referential actions, enums, cardinalities, and inferred business rules.
- Excluded by request: RDF, OWL, ontologies, semantic-web modeling, and graph-database concepts.
- The diagrams show the physical relational model. Inferred rules and recommendations are clearly labeled and are not represented as existing database constraints.

## Domain overview

| Domain                         | Tables                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Authentication & Authorization | `User`, `Account`, `Session`, `VerificationToken`, `Role`, `Permission`, `RolePermission`                   |
| Content & Navigation           | `Page`, `Section`, `Seo`, `Setting`, `Menu`, `MenuItem`, `Media`, `Redirect`                                |
| Offerings & Learning           | `ServiceCategory`, `Service`, `TrainingCategory`, `Training`, `CaseStudy`                                   |
| Publishing                     | `ArticleCategory`, `Tag`, `Article`, `ArticleTag`, `ArticleRelation`                                        |
| Engagement & CRM               | `Faq`, `Testimonial`, `NewsletterSubscriber`, `ContactRequest`, `Appointment`, `Event`, `EventRegistration` |
| Organization & Observability   | `TeamMember`, `AnalyticsEvent`, `AuditLog`                                                                  |

## Diagram notation

| Symbol                  | Meaning                                                                          |
| ----------------------- | -------------------------------------------------------------------------------- |
| PK                      | Primary key                                                                      |
| FK                      | Foreign key                                                                      |
| UQ / UK                 | Unique constraint                                                                |
| `                       |                                                                                  | `   | Exactly one                                                                     |
| `                       | o`/`o                                                                            | `   | Zero or one; mirrored according to which side of the relationship it appears on |
| `}o` / `o{`             | Zero or many; mirrored according to which side of the relationship it appears on |
| Solid relationship line | Enforced foreign key                                                             |
| Blue entity             | Core or high-traffic entity                                                      |
| Gray entity             | Junction entity                                                                  |

## Enum reference

### UserStatus

- `ACTIVE`
- `INVITED`
- `SUSPENDED`

### ContentStatus

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

### RequestStatus

- `NEW`
- `IN_PROGRESS`
- `DONE`
- `CANCELLED`

### MenuLocation

- `HEADER`
- `FOOTER`
- `MOBILE`

### Difficulty

- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

## Relationship and referential-action matrix

| Parent             | Child FK                           | Cardinality                           | Relationship     | On delete | On update |
| ------------------ | ---------------------------------- | ------------------------------------- | ---------------- | --------- | --------- |
| `Role`             | `User.roleId`                      | Role 0..1 — 0..* User                 | assigned to      | SET NULL  | CASCADE   |
| `User`             | `Account.userId`                   | User 1 — 0..* Account                 | owns             | CASCADE   | CASCADE   |
| `User`             | `Session.userId`                   | User 1 — 0..* Session                 | has              | CASCADE   | CASCADE   |
| `Role`             | `RolePermission.roleId`            | Role 1 — 0..* RolePermission          | grants through   | CASCADE   | CASCADE   |
| `Permission`       | `RolePermission.permissionId`      | Permission 1 — 0..* RolePermission    | assigned through | CASCADE   | CASCADE   |
| `Page`             | `Section.pageId`                   | Page 1 — 0..* Section                 | contains         | CASCADE   | CASCADE   |
| `Page`             | `Seo.pageId`                       | Page 0..1 — 0..1 Seo                  | has SEO          | CASCADE   | CASCADE   |
| `Service`          | `Seo.serviceId`                    | Service 0..1 — 0..1 Seo               | has SEO          | CASCADE   | CASCADE   |
| `Training`         | `Seo.trainingId`                   | Training 0..1 — 0..1 Seo              | has SEO          | CASCADE   | CASCADE   |
| `Article`          | `Seo.articleId`                    | Article 0..1 — 0..1 Seo               | has SEO          | CASCADE   | CASCADE   |
| `CaseStudy`        | `Seo.caseStudyId`                  | CaseStudy 0..1 — 0..1 Seo             | has SEO          | CASCADE   | CASCADE   |
| `ServiceCategory`  | `Service.categoryId`               | ServiceCategory 0..1 — 0..* Service   | classifies       | SET NULL  | CASCADE   |
| `TrainingCategory` | `Training.categoryId`              | TrainingCategory 0..1 — 0..* Training | classifies       | SET NULL  | CASCADE   |
| `ArticleCategory`  | `Article.categoryId`               | ArticleCategory 0..1 — 0..* Article   | classifies       | SET NULL  | CASCADE   |
| `User`             | `Article.authorId`                 | User 0..1 — 0..* Article              | authors          | SET NULL  | CASCADE   |
| `Article`          | `ArticleTag.articleId`             | Article 1 — 0..* ArticleTag           | tagged through   | CASCADE   | CASCADE   |
| `Tag`              | `ArticleTag.tagId`                 | Tag 1 — 0..* ArticleTag               | labels through   | CASCADE   | CASCADE   |
| `Article`          | `ArticleRelation.fromId`           | Article 1 — 0..* ArticleRelation      | relates from     | CASCADE   | CASCADE   |
| `Article`          | `ArticleRelation.toId`             | Article 1 — 0..* ArticleRelation      | relates to       | CASCADE   | CASCADE   |
| `Service`          | `CaseStudy.serviceId`              | Service 0..1 — 0..* CaseStudy         | demonstrated by  | SET NULL  | CASCADE   |
| `User`             | `Appointment.assignedConsultantId` | User 0..1 — 0..* Appointment          | assigned to      | SET NULL  | CASCADE   |
| `Menu`             | `MenuItem.menuId`                  | Menu 1 — 0..* MenuItem                | contains         | CASCADE   | CASCADE   |
| `MenuItem`         | `MenuItem.parentId`                | MenuItem 0..1 — 0..* MenuItem         | parent of        | CASCADE   | CASCADE   |
| `User`             | `AuditLog.userId`                  | User 0..1 — 0..* AuditLog             | performs         | SET NULL  | CASCADE   |
| `Event`            | `EventRegistration.eventId`        | Event 1 — 0..* EventRegistration      | receives         | CASCADE   | CASCADE   |

### Many-to-many and recursive structures

- `Role` and `Permission` are many-to-many through `RolePermission`, whose composite primary key prevents duplicate assignments.
- `Article` and `Tag` are many-to-many through `ArticleTag`, whose composite primary key prevents duplicate tag assignments.
- `ArticleRelation` is a directed self-referencing junction from `Article.fromId` to `Article.toId`. Its composite primary key prevents the same directed pair from being inserted twice.
- `MenuItem.parentId` is a nullable self-reference that models a menu tree. Deleting a parent uses `ON DELETE CASCADE`, so its descendant rows are deleted by the database.
- `Seo` has five nullable, individually unique owner foreign keys. Each owner-to-SEO association is optional one-to-one, but the database does not currently enforce that exactly one owner column is populated.

## Table data dictionary

### User

**Domain:** Authentication & Authorization  
**Purpose:** Application identities, credentials linkage, status, and optional role assignment.  
**Primary key:** `id`

| Key  | Column          | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | --------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`            | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`          | `TEXT`          |      Yes | —                    | —                         |
| `UQ` | `email`         | `TEXT`          |       No | —                    | —                         |
| —    | `emailVerified` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `image`         | `TEXT`          |      Yes | —                    | —                         |
| —    | `passwordHash`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`        | `UserStatus`    |       No | `'ACTIVE'`           | —                         |
| `FK` | `roleId`        | `TEXT`          |      Yes | —                    | —                         |
| —    | `createdAt`     | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`     | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `roleId` → `Role.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `User_email_key (email)`.

**Relationships**

- Belongs to `Role` through `roleId` (zero or one parent).
- Has zero or many `Account` rows through `Account.userId`.
- Has zero or many `Session` rows through `Session.userId`.
- Has zero or many `Article` rows through `Article.authorId`.
- Has zero or many `Appointment` rows through `Appointment.assignedConsultantId`.
- Has zero or many `AuditLog` rows through `AuditLog.userId`.

**Business rules represented or inferred**

- Email is unique but case sensitivity follows PostgreSQL TEXT semantics.
- A user may exist without a role or local password (for external authentication).

### Account

**Domain:** Authentication & Authorization  
**Purpose:** External authentication-provider accounts linked to users.  
**Primary key:** `provider` + `providerAccountId`

| Key  | Column              | PostgreSQL type | Nullable | Default / generation | Notes |
| ---- | ------------------- | --------------- | -------: | -------------------- | ----- |
| `FK` | `userId`            | `TEXT`          |       No | —                    | —     |
| —    | `type`              | `TEXT`          |       No | —                    | —     |
| `PK` | `provider`          | `TEXT`          |       No | —                    | —     |
| `PK` | `providerAccountId` | `TEXT`          |       No | —                    | —     |
| —    | `refresh_token`     | `TEXT`          |      Yes | —                    | —     |
| —    | `access_token`      | `TEXT`          |      Yes | —                    | —     |
| —    | `expires_at`        | `INTEGER`       |      Yes | —                    | —     |
| —    | `token_type`        | `TEXT`          |      Yes | —                    | —     |
| —    | `scope`             | `TEXT`          |      Yes | —                    | —     |
| —    | `id_token`          | `TEXT`          |      Yes | —                    | —     |
| —    | `session_state`     | `TEXT`          |      Yes | —                    | —     |

**Foreign keys**

- `userId` → `User.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Composite primary key `Account_pkey (provider, providerAccountId)`.

**Relationships**

- Belongs to `User` through `userId` (exactly one parent).

**Business rules represented or inferred**

- Provider plus providerAccountId uniquely identifies an account.
- Deleting a user cascades to provider accounts.

### Session

**Domain:** Authentication & Authorization  
**Purpose:** Persisted authentication sessions associated with users.  
**Primary key:** `sessionToken`

| Key       | Column         | PostgreSQL type | Nullable | Default / generation | Notes |
| --------- | -------------- | --------------- | -------: | -------------------- | ----- |
| `PK` `UQ` | `sessionToken` | `TEXT`          |       No | —                    | —     |
| `FK`      | `userId`       | `TEXT`          |       No | —                    | —     |
| —         | `expires`      | `TIMESTAMP(3)`  |       No | —                    | —     |

**Foreign keys**

- `userId` → `User.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `Session_sessionToken_key (sessionToken)`.

**Relationships**

- Belongs to `User` through `userId` (exactly one parent).

**Business rules represented or inferred**

- The session token is both the primary key and covered by a separate unique index.
- Deleting a user cascades to sessions.

### VerificationToken

**Domain:** Authentication & Authorization  
**Purpose:** Short-lived tokens used by authentication verification flows.  
**Primary key:** `identifier` + `token`

| Key       | Column       | PostgreSQL type | Nullable | Default / generation | Notes |
| --------- | ------------ | --------------- | -------: | -------------------- | ----- |
| `PK`      | `identifier` | `TEXT`          |       No | —                    | —     |
| `PK` `UQ` | `token`      | `TEXT`          |       No | —                    | —     |
| —         | `expires`    | `TIMESTAMP(3)`  |       No | —                    | —     |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Composite primary key `VerificationToken_pkey (identifier, token)`.
- Unique constraint `VerificationToken_token_key (token)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Token is globally unique in addition to the composite primary key.

### Role

**Domain:** Authentication & Authorization  
**Purpose:** Named authorization roles assigned to users.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `UQ` | `name`        | `TEXT`          |       No | —                    | —                         |
| —    | `description` | `TEXT`          |      Yes | —                    | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Role_name_key (name)`.

**Relationships**

- Has zero or many `User` rows through `User.roleId`.
- Has zero or many `RolePermission` rows through `RolePermission.roleId`.

**Business rules represented or inferred**

- Role names are globally unique.

### Permission

**Domain:** Authentication & Authorization  
**Purpose:** Atomic authorization capabilities attached to roles.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `UQ` | `key`         | `TEXT`          |       No | —                    | —                         |
| —    | `description` | `TEXT`          |      Yes | —                    | —                         |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Permission_key_key (key)`.

**Relationships**

- Has zero or many `RolePermission` rows through `RolePermission.permissionId`.

**Business rules represented or inferred**

- Permission keys are globally unique.

### RolePermission

**Domain:** Authentication & Authorization  
**Purpose:** Junction table implementing the many-to-many role-permission assignment.  
**Primary key:** `roleId` + `permissionId`

| Key       | Column         | PostgreSQL type | Nullable | Default / generation | Notes |
| --------- | -------------- | --------------- | -------: | -------------------- | ----- |
| `PK` `FK` | `roleId`       | `TEXT`          |       No | —                    | —     |
| `PK` `FK` | `permissionId` | `TEXT`          |       No | —                    | —     |

**Foreign keys**

- `roleId` → `Role.id`; required parent; on delete CASCADE, on update CASCADE.
- `permissionId` → `Permission.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Composite primary key `RolePermission_pkey (roleId, permissionId)`.

**Relationships**

- Belongs to `Role` through `roleId` (exactly one parent).
- Belongs to `Permission` through `permissionId` (exactly one parent).

**Business rules represented or inferred**

- Both foreign keys cascade on delete.
- The composite primary key prevents duplicate assignments.

### Page

**Domain:** Content & Navigation  
**Purpose:** Localized CMS pages and their publication lifecycle.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `locale`      | `TEXT`          |       No | `'fr'`               | —                         |
| —    | `title`       | `TEXT`          |       No | —                    | —                         |
| —    | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `eyebrow`     | `TEXT`          |      Yes | —                    | —                         |
| —    | `headline`    | `TEXT`          |      Yes | —                    | —                         |
| —    | `description` | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`      | `ContentStatus` |       No | `'DRAFT'`            | —                         |
| —    | `publishedAt` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Page_locale_slug_key (locale, slug)`.
- Index `Page_status_publishedAt_idx (status, publishedAt)`.

**Relationships**

- Has zero or many `Section` rows through `Section.pageId`.
- Has zero or one `Seo` rows through `Seo.pageId`.

**Business rules represented or inferred**

- Slug uniqueness is scoped by locale.
- A page owns zero or more ordered sections and at most one SEO record.

### Section

**Domain:** Content & Navigation  
**Purpose:** Ordered structured content blocks belonging to a page.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `FK` | `pageId`    | `TEXT`          |       No | —                    | —                         |
| —    | `type`      | `TEXT`          |       No | —                    | —                         |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `data`      | `JSONB`         |       No | —                    | —                         |
| —    | `order`     | `INTEGER`       |       No | `0`                  | —                         |
| —    | `visible`   | `BOOLEAN`       |       No | `true`               | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `pageId` → `Page.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Index `Section_pageId_order_idx (pageId, order)`.

**Relationships**

- Belongs to `Page` through `pageId` (exactly one parent).

**Business rules represented or inferred**

- Deleting a page cascades to all sections.
- Section shape is governed by application validation of JSONB data.

### Seo

**Domain:** Content & Navigation  
**Purpose:** Optional one-to-one SEO metadata for one of several content types.  
**Primary key:** `id`

| Key       | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| --------- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK`      | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `FK` `UQ` | `pageId`      | `TEXT`          |      Yes | —                    | —                         |
| `FK` `UQ` | `serviceId`   | `TEXT`          |      Yes | —                    | —                         |
| `FK` `UQ` | `trainingId`  | `TEXT`          |      Yes | —                    | —                         |
| `FK` `UQ` | `articleId`   | `TEXT`          |      Yes | —                    | —                         |
| `FK` `UQ` | `caseStudyId` | `TEXT`          |      Yes | —                    | —                         |
| —         | `title`       | `TEXT`          |       No | —                    | —                         |
| —         | `description` | `TEXT`          |       No | —                    | —                         |
| —         | `keywords`    | `TEXT[]`        |       No | —                    | —                         |
| —         | `canonical`   | `TEXT`          |      Yes | —                    | —                         |
| —         | `ogImage`     | `TEXT`          |      Yes | —                    | —                         |
| —         | `schema`      | `JSONB`         |      Yes | —                    | —                         |
| —         | `noIndex`     | `BOOLEAN`       |       No | `false`              | —                         |

**Foreign keys**

- `pageId` → `Page.id`; optional parent; on delete CASCADE, on update CASCADE.
- `serviceId` → `Service.id`; optional parent; on delete CASCADE, on update CASCADE.
- `trainingId` → `Training.id`; optional parent; on delete CASCADE, on update CASCADE.
- `articleId` → `Article.id`; optional parent; on delete CASCADE, on update CASCADE.
- `caseStudyId` → `CaseStudy.id`; optional parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `Seo_pageId_key (pageId)`.
- Unique constraint `Seo_serviceId_key (serviceId)`.
- Unique constraint `Seo_trainingId_key (trainingId)`.
- Unique constraint `Seo_articleId_key (articleId)`.
- Unique constraint `Seo_caseStudyId_key (caseStudyId)`.

**Relationships**

- Belongs to `Page` through `pageId` (zero or one parent).
- Belongs to `Service` through `serviceId` (zero or one parent).
- Belongs to `Training` through `trainingId` (zero or one parent).
- Belongs to `Article` through `articleId` (zero or one parent).
- Belongs to `CaseStudy` through `caseStudyId` (zero or one parent).

**Business rules represented or inferred**

- Each content foreign key is individually unique, creating optional one-to-one links.
- The database does not enforce that exactly one content foreign key is populated.

### Setting

**Domain:** Content & Navigation  
**Purpose:** Keyed JSON configuration grouped by application area.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `UQ` | `key`       | `TEXT`          |       No | —                    | —                         |
| —    | `value`     | `JSONB`         |       No | —                    | —                         |
| —    | `group`     | `TEXT`          |       No | `'general'`          | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Setting_key_key (key)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Setting keys are globally unique.
- JSON value shape is application-defined.

### Menu

**Domain:** Content & Navigation  
**Purpose:** Localized navigation menus by fixed header/footer location.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `location`  | `MenuLocation`  |       No | —                    | —                         |
| —    | `locale`    | `TEXT`          |       No | `'fr'`               | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Menu_location_locale_key (location, locale)`.

**Relationships**

- Has zero or many `MenuItem` rows through `MenuItem.menuId`.

**Business rules represented or inferred**

- Only one menu may exist per location and locale.

### MenuItem

**Domain:** Content & Navigation  
**Purpose:** Ordered hierarchical navigation entries belonging to a menu.  
**Primary key:** `id`

| Key  | Column     | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ---------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`       | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `FK` | `menuId`   | `TEXT`          |       No | —                    | —                         |
| `FK` | `parentId` | `TEXT`          |      Yes | —                    | —                         |
| —    | `label`    | `TEXT`          |       No | —                    | —                         |
| —    | `url`      | `TEXT`          |       No | —                    | —                         |
| —    | `external` | `BOOLEAN`       |       No | `false`              | —                         |
| —    | `order`    | `INTEGER`       |       No | `0`                  | —                         |
| —    | `visible`  | `BOOLEAN`       |       No | `true`               | —                         |

**Foreign keys**

- `menuId` → `Menu.id`; required parent; on delete CASCADE, on update CASCADE.
- `parentId` → `MenuItem.id`; optional parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Index `MenuItem_menuId_order_idx (menuId, order)`.

**Relationships**

- Belongs to `Menu` through `menuId` (exactly one parent).
- Belongs to `MenuItem` through `parentId` (zero or one parent).
- Has zero or many `MenuItem` rows through `MenuItem.parentId`.

**Business rules represented or inferred**

- parentId creates a self-referencing tree.
- Deleting a parent cascades through its descendant subtree.

### Media

**Domain:** Content & Navigation  
**Purpose:** Metadata for uploaded media assets.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `url`       | `TEXT`          |       No | —                    | —                         |
| `UQ` | `key`       | `TEXT`          |      Yes | —                    | —                         |
| —    | `mimeType`  | `TEXT`          |       No | —                    | —                         |
| —    | `size`      | `INTEGER`       |       No | —                    | —                         |
| —    | `width`     | `INTEGER`       |      Yes | —                    | —                         |
| —    | `height`    | `INTEGER`       |      Yes | —                    | —                         |
| —    | `alt`       | `TEXT`          |       No | —                    | —                         |
| —    | `folder`    | `TEXT`          |      Yes | `'/'`                | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Media_key_key (key)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Provider storage key is optional but unique when present.

### Redirect

**Domain:** Content & Navigation  
**Purpose:** Managed source-to-target URL redirects.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `UQ` | `source`    | `TEXT`          |       No | —                    | —                         |
| —    | `target`    | `TEXT`          |       No | —                    | —                         |
| —    | `permanent` | `BOOLEAN`       |       No | `true`               | —                         |
| —    | `active`    | `BOOLEAN`       |       No | `true`               | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Redirect_source_key (source)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Redirect source is globally unique.

### ServiceCategory

**Domain:** Offerings & Learning  
**Purpose:** Ordered taxonomy for consulting and data services.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`        | `TEXT`          |       No | —                    | —                         |
| `UQ` | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `description` | `TEXT`          |      Yes | —                    | —                         |
| —    | `order`       | `INTEGER`       |       No | `0`                  | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `ServiceCategory_slug_key (slug)`.

**Relationships**

- Has zero or many `Service` rows through `Service.categoryId`.

**Business rules represented or inferred**

- Category slug is globally unique.

### Service

**Domain:** Offerings & Learning  
**Purpose:** Localized service offerings, content, ordering, and publication state.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `locale`      | `TEXT`          |       No | `'fr'`               | —                         |
| `FK` | `categoryId`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `title`       | `TEXT`          |       No | —                    | —                         |
| —    | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `excerpt`     | `TEXT`          |       No | —                    | —                         |
| —    | `content`     | `JSONB`         |       No | —                    | —                         |
| —    | `icon`        | `TEXT`          |      Yes | —                    | —                         |
| —    | `image`       | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`      | `ContentStatus` |       No | `'DRAFT'`            | —                         |
| —    | `order`       | `INTEGER`       |       No | `0`                  | —                         |
| —    | `featured`    | `BOOLEAN`       |       No | `false`              | —                         |
| —    | `publishedAt` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `categoryId` → `ServiceCategory.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `Service_locale_slug_key (locale, slug)`.
- Index `Service_status_order_idx (status, order)`.

**Relationships**

- Belongs to `ServiceCategory` through `categoryId` (zero or one parent).
- Has zero or one `Seo` rows through `Seo.serviceId`.
- Has zero or many `CaseStudy` rows through `CaseStudy.serviceId`.

**Business rules represented or inferred**

- Slug uniqueness is scoped by locale.
- Category assignment is optional.

### TrainingCategory

**Domain:** Offerings & Learning  
**Purpose:** Ordered taxonomy for training products.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`        | `TEXT`          |       No | —                    | —                         |
| `UQ` | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `description` | `TEXT`          |      Yes | —                    | —                         |
| —    | `order`       | `INTEGER`       |       No | `0`                  | —                         |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `TrainingCategory_slug_key (slug)`.

**Relationships**

- Has zero or many `Training` rows through `Training.categoryId`.

**Business rules represented or inferred**

- Category slug is globally unique.

### Training

**Domain:** Offerings & Learning  
**Purpose:** Localized training products, curricula, commercial fields, and publication state.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `locale`      | `TEXT`          |       No | `'fr'`               | —                         |
| `FK` | `categoryId`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `title`       | `TEXT`          |       No | —                    | —                         |
| —    | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `excerpt`     | `TEXT`          |       No | —                    | —                         |
| —    | `content`     | `JSONB`         |       No | —                    | —                         |
| —    | `objectives`  | `TEXT[]`        |       No | —                    | —                         |
| —    | `audience`    | `TEXT[]`        |       No | —                    | —                         |
| —    | `modules`     | `JSONB`         |       No | —                    | —                         |
| —    | `priceCents`  | `INTEGER`       |      Yes | —                    | —                         |
| —    | `duration`    | `TEXT`          |      Yes | —                    | —                         |
| —    | `image`       | `TEXT`          |      Yes | —                    | —                         |
| —    | `pdfUrl`      | `TEXT`          |      Yes | —                    | —                         |
| —    | `instructor`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `difficulty`  | `Difficulty`    |       No | `'ALL_LEVELS'`       | —                         |
| —    | `status`      | `ContentStatus` |       No | `'DRAFT'`            | —                         |
| —    | `featured`    | `BOOLEAN`       |       No | `false`              | —                         |
| —    | `order`       | `INTEGER`       |       No | `0`                  | —                         |
| —    | `publishedAt` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `categoryId` → `TrainingCategory.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `Training_locale_slug_key (locale, slug)`.
- Index `Training_status_order_idx (status, order)`.

**Relationships**

- Belongs to `TrainingCategory` through `categoryId` (zero or one parent).
- Has zero or one `Seo` rows through `Seo.trainingId`.

**Business rules represented or inferred**

- Slug uniqueness is scoped by locale.
- Category assignment and price are optional.

### CaseStudy

**Domain:** Offerings & Learning  
**Purpose:** Localized client case-study content optionally associated with a service.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `locale`      | `TEXT`          |       No | `'fr'`               | —                         |
| `FK` | `serviceId`   | `TEXT`          |      Yes | —                    | —                         |
| —    | `title`       | `TEXT`          |       No | —                    | —                         |
| —    | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `company`     | `TEXT`          |       No | —                    | —                         |
| —    | `companyLogo` | `TEXT`          |      Yes | —                    | —                         |
| —    | `sector`      | `TEXT`          |      Yes | —                    | —                         |
| —    | `teamSize`    | `INTEGER`       |      Yes | —                    | —                         |
| —    | `excerpt`     | `TEXT`          |       No | —                    | —                         |
| —    | `before`      | `TEXT`          |       No | —                    | —                         |
| —    | `after`       | `TEXT`          |       No | —                    | —                         |
| —    | `content`     | `JSONB`         |       No | —                    | —                         |
| —    | `metrics`     | `JSONB`         |       No | —                    | —                         |
| —    | `gallery`     | `TEXT[]`        |       No | —                    | —                         |
| —    | `coverImage`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`      | `ContentStatus` |       No | `'DRAFT'`            | —                         |
| —    | `featured`    | `BOOLEAN`       |       No | `false`              | —                         |
| —    | `publishedAt` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `serviceId` → `Service.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `CaseStudy_locale_slug_key (locale, slug)`.
- Index `CaseStudy_status_publishedAt_idx (status, publishedAt)`.

**Relationships**

- Belongs to `Service` through `serviceId` (zero or one parent).
- Has zero or one `Seo` rows through `Seo.caseStudyId`.

**Business rules represented or inferred**

- Slug uniqueness is scoped by locale.
- Service association is optional.

### ArticleCategory

**Domain:** Publishing  
**Purpose:** Taxonomy for editorial articles.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`        | `TEXT`          |       No | —                    | —                         |
| `UQ` | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `description` | `TEXT`          |      Yes | —                    | —                         |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `ArticleCategory_slug_key (slug)`.

**Relationships**

- Has zero or many `Article` rows through `Article.categoryId`.

**Business rules represented or inferred**

- Category slug is globally unique.

### Tag

**Domain:** Publishing  
**Purpose:** Reusable tags linked to articles through a junction table.  
**Primary key:** `id`

| Key  | Column | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------ | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`   | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name` | `TEXT`          |       No | —                    | —                         |
| `UQ` | `slug` | `TEXT`          |       No | —                    | —                         |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Tag_slug_key (slug)`.

**Relationships**

- Has zero or many `ArticleTag` rows through `ArticleTag.tagId`.

**Business rules represented or inferred**

- Tag slug is globally unique.

### Article

**Domain:** Publishing  
**Purpose:** Localized editorial content, authorship, scheduling, and publication state.  
**Primary key:** `id`

| Key  | Column         | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | -------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`           | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `locale`       | `TEXT`          |       No | `'fr'`               | —                         |
| `FK` | `categoryId`   | `TEXT`          |      Yes | —                    | —                         |
| `FK` | `authorId`     | `TEXT`          |      Yes | —                    | —                         |
| —    | `title`        | `TEXT`          |       No | —                    | —                         |
| —    | `slug`         | `TEXT`          |       No | —                    | —                         |
| —    | `excerpt`      | `TEXT`          |       No | —                    | —                         |
| —    | `content`      | `JSONB`         |       No | —                    | —                         |
| —    | `coverImage`   | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`       | `ContentStatus` |       No | `'DRAFT'`            | —                         |
| —    | `readingTime`  | `INTEGER`       |       No | `5`                  | —                         |
| —    | `featured`     | `BOOLEAN`       |       No | `false`              | —                         |
| —    | `scheduledFor` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `publishedAt`  | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `createdAt`    | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`    | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `categoryId` → `ArticleCategory.id`; optional parent; on delete SET NULL, on update CASCADE.
- `authorId` → `User.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `Article_locale_slug_key (locale, slug)`.
- Index `Article_status_publishedAt_idx (status, publishedAt)`.

**Relationships**

- Belongs to `ArticleCategory` through `categoryId` (zero or one parent).
- Belongs to `User` through `authorId` (zero or one parent).
- Has zero or one `Seo` rows through `Seo.articleId`.
- Has zero or many `ArticleTag` rows through `ArticleTag.articleId`.
- Has zero or many `ArticleRelation` rows through `ArticleRelation.fromId`.
- Has zero or many `ArticleRelation` rows through `ArticleRelation.toId`.

**Business rules represented or inferred**

- Slug uniqueness is scoped by locale.
- Category and author are optional.

### ArticleTag

**Domain:** Publishing  
**Purpose:** Junction table implementing the many-to-many article-tag relationship.  
**Primary key:** `articleId` + `tagId`

| Key       | Column      | PostgreSQL type | Nullable | Default / generation | Notes |
| --------- | ----------- | --------------- | -------: | -------------------- | ----- |
| `PK` `FK` | `articleId` | `TEXT`          |       No | —                    | —     |
| `PK` `FK` | `tagId`     | `TEXT`          |       No | —                    | —     |

**Foreign keys**

- `articleId` → `Article.id`; required parent; on delete CASCADE, on update CASCADE.
- `tagId` → `Tag.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Composite primary key `ArticleTag_pkey (articleId, tagId)`.

**Relationships**

- Belongs to `Article` through `articleId` (exactly one parent).
- Belongs to `Tag` through `tagId` (exactly one parent).

**Business rules represented or inferred**

- Both foreign keys cascade on delete.
- The composite primary key prevents duplicate tag assignments.

### ArticleRelation

**Domain:** Publishing  
**Purpose:** Directional self-junction relating one article to another.  
**Primary key:** `fromId` + `toId`

| Key       | Column   | PostgreSQL type | Nullable | Default / generation | Notes |
| --------- | -------- | --------------- | -------: | -------------------- | ----- |
| `PK` `FK` | `fromId` | `TEXT`          |       No | —                    | —     |
| `PK` `FK` | `toId`   | `TEXT`          |       No | —                    | —     |

**Foreign keys**

- `fromId` → `Article.id`; required parent; on delete CASCADE, on update CASCADE.
- `toId` → `Article.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Composite primary key `ArticleRelation_pkey (fromId, toId)`.

**Relationships**

- Belongs to `Article` through `fromId` (exactly one parent).
- Belongs to `Article` through `toId` (exactly one parent).

**Business rules represented or inferred**

- Both foreign keys cascade on delete.
- Direction is significant; reverse pairs are independently possible.

### Faq

**Domain:** Engagement & CRM  
**Purpose:** Frequently asked questions with category, ordering, and visibility.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `category`  | `TEXT`          |       No | —                    | —                         |
| —    | `question`  | `TEXT`          |       No | —                    | —                         |
| —    | `answer`    | `TEXT`          |       No | —                    | —                         |
| —    | `order`     | `INTEGER`       |       No | `0`                  | —                         |
| —    | `visible`   | `BOOLEAN`       |       No | `true`               | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- No secondary indexes or unique constraints beyond the primary key.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Ordering and visibility are application-managed.

### Testimonial

**Domain:** Engagement & CRM  
**Purpose:** Customer testimonial content and display controls.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `company`   | `TEXT`          |      Yes | —                    | —                         |
| —    | `position`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `quote`     | `TEXT`          |       No | —                    | —                         |
| —    | `avatar`    | `TEXT`          |      Yes | —                    | —                         |
| —    | `rating`    | `INTEGER`       |       No | `5`                  | —                         |
| —    | `visible`   | `BOOLEAN`       |       No | `true`               | —                         |
| —    | `order`     | `INTEGER`       |       No | `0`                  | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- No secondary indexes or unique constraints beyond the primary key.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- The database does not constrain rating to a valid range.

### NewsletterSubscriber

**Domain:** Engagement & CRM  
**Purpose:** Newsletter subscription lifecycle and source attribution.  
**Primary key:** `id`

| Key  | Column           | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ---------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`             | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `UQ` | `email`          | `TEXT`          |       No | —                    | —                         |
| —    | `locale`         | `TEXT`          |       No | `'fr'`               | —                         |
| —    | `source`         | `TEXT`          |      Yes | —                    | —                         |
| —    | `confirmedAt`    | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `unsubscribedAt` | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `createdAt`      | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `NewsletterSubscriber_email_key (email)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Email is unique but case sensitivity follows PostgreSQL TEXT semantics.

### ContactRequest

**Domain:** Engagement & CRM  
**Purpose:** Inbound contact-form requests and processing state.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`        | `TEXT`          |       No | —                    | —                         |
| —    | `email`       | `TEXT`          |       No | —                    | —                         |
| —    | `phone`       | `TEXT`          |      Yes | —                    | —                         |
| —    | `company`     | `TEXT`          |      Yes | —                    | —                         |
| —    | `subject`     | `TEXT`          |      Yes | —                    | —                         |
| —    | `message`     | `TEXT`          |       No | —                    | —                         |
| —    | `status`      | `RequestStatus` |       No | `'NEW'`              | —                         |
| —    | `replyStatus` | `TEXT`          |      Yes | —                    | —                         |
| —    | `metadata`    | `JSONB`         |      Yes | —                    | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Index `ContactRequest_status_createdAt_idx (status, createdAt)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Request processing uses RequestStatus; replyStatus remains free text.

### Appointment

**Domain:** Engagement & CRM  
**Purpose:** Appointment requests, scheduling preference, consultant assignment, and notes.  
**Primary key:** `id`

| Key  | Column                 | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ---------------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`                   | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`                 | `TEXT`          |       No | —                    | —                         |
| —    | `email`                | `TEXT`          |       No | —                    | —                         |
| —    | `phone`                | `TEXT`          |      Yes | —                    | —                         |
| —    | `company`              | `TEXT`          |      Yes | —                    | —                         |
| —    | `preferredDate`        | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `topic`                | `TEXT`          |      Yes | —                    | —                         |
| —    | `message`              | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`               | `RequestStatus` |       No | `'NEW'`              | —                         |
| `FK` | `assignedConsultantId` | `TEXT`          |      Yes | —                    | —                         |
| —    | `notes`                | `TEXT`          |      Yes | —                    | —                         |
| —    | `createdAt`            | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`            | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `assignedConsultantId` → `User.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Index `Appointment_status_preferredDate_idx (status, preferredDate)`.

**Relationships**

- Belongs to `User` through `assignedConsultantId` (zero or one parent).

**Business rules represented or inferred**

- Consultant assignment is optional and set to null if the user is deleted.

### Event

**Domain:** Engagement & CRM  
**Purpose:** Published event schedule, audience, capacity, and registration ownership.  
**Primary key:** `id`

| Key  | Column        | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ------------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`          | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `UQ` | `slug`        | `TEXT`          |       No | —                    | —                         |
| —    | `title`       | `TEXT`          |       No | —                    | —                         |
| —    | `description` | `TEXT`          |       No | —                    | —                         |
| —    | `type`        | `TEXT`          |       No | —                    | —                         |
| —    | `audience`    | `TEXT`          |       No | —                    | —                         |
| —    | `location`    | `TEXT`          |       No | —                    | —                         |
| —    | `host`        | `TEXT`          |       No | —                    | —                         |
| —    | `startAt`     | `TIMESTAMP(3)`  |       No | —                    | —                         |
| —    | `endAt`       | `TIMESTAMP(3)`  |      Yes | —                    | —                         |
| —    | `image`       | `TEXT`          |      Yes | —                    | —                         |
| —    | `capacity`    | `INTEGER`       |      Yes | —                    | —                         |
| —    | `status`      | `ContentStatus` |       No | `'DRAFT'`            | —                         |
| —    | `createdAt`   | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt`   | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Unique constraint `Event_slug_key (slug)`.
- Index `Event_status_startAt_idx (status, startAt)`.

**Relationships**

- Has zero or many `EventRegistration` rows through `EventRegistration.eventId`.

**Business rules represented or inferred**

- Event slug is globally unique.
- Capacity and chronological consistency are not constrained by database checks.

### EventRegistration

**Domain:** Engagement & CRM  
**Purpose:** Per-event attendee registration and processing state.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `FK` | `eventId`   | `TEXT`          |       No | —                    | —                         |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `email`     | `TEXT`          |       No | —                    | —                         |
| —    | `phone`     | `TEXT`          |      Yes | —                    | —                         |
| —    | `company`   | `TEXT`          |      Yes | —                    | —                         |
| —    | `message`   | `TEXT`          |      Yes | —                    | —                         |
| —    | `status`    | `RequestStatus` |       No | `'NEW'`              | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- `eventId` → `Event.id`; required parent; on delete CASCADE, on update CASCADE.

**Unique constraints and indexes**

- Unique constraint `EventRegistration_eventId_email_key (eventId, email)`.
- Index `EventRegistration_eventId_createdAt_idx (eventId, createdAt)`.

**Relationships**

- Belongs to `Event` through `eventId` (exactly one parent).

**Business rules represented or inferred**

- An email may register only once per event.
- Deleting an event cascades to registrations.

### TeamMember

**Domain:** Organization & Observability  
**Purpose:** Team profile content and visibility controls.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `position`  | `TEXT`          |       No | —                    | —                         |
| —    | `biography` | `TEXT`          |       No | —                    | —                         |
| —    | `picture`   | `TEXT`          |      Yes | —                    | —                         |
| —    | `linkedin`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `social`    | `JSONB`         |      Yes | —                    | —                         |
| —    | `order`     | `INTEGER`       |       No | `0`                  | —                         |
| —    | `visible`   | `BOOLEAN`       |       No | `true`               | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |
| —    | `updatedAt` | `TIMESTAMP(3)`  |       No | —                    | Prisma-managed @updatedAt |

**Foreign keys**

- None.

**Unique constraints and indexes**

- No secondary indexes or unique constraints beyond the primary key.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- Social links may be stored as flexible JSONB.

### AnalyticsEvent

**Domain:** Organization & Observability  
**Purpose:** Append-only lightweight analytics events.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| —    | `name`      | `TEXT`          |       No | —                    | —                         |
| —    | `path`      | `TEXT`          |      Yes | —                    | —                         |
| —    | `sessionId` | `TEXT`          |      Yes | —                    | —                         |
| —    | `metadata`  | `JSONB`         |      Yes | —                    | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |

**Foreign keys**

- None.

**Unique constraints and indexes**

- Index `AnalyticsEvent_name_createdAt_idx (name, createdAt)`.

**Relationships**

- No foreign-key relationships.

**Business rules represented or inferred**

- No foreign key links sessionId to authentication sessions.

### AuditLog

**Domain:** Organization & Observability  
**Purpose:** Append-only administrative audit records with optional user attribution.  
**Primary key:** `id`

| Key  | Column      | PostgreSQL type | Nullable | Default / generation | Notes                     |
| ---- | ----------- | --------------- | -------: | -------------------- | ------------------------- |
| `PK` | `id`        | `TEXT`          |       No | —                    | Prisma app default cuid() |
| `FK` | `userId`    | `TEXT`          |      Yes | —                    | —                         |
| —    | `action`    | `TEXT`          |       No | —                    | —                         |
| —    | `entity`    | `TEXT`          |       No | —                    | —                         |
| —    | `entityId`  | `TEXT`          |      Yes | —                    | —                         |
| —    | `before`    | `JSONB`         |      Yes | —                    | —                         |
| —    | `after`     | `JSONB`         |      Yes | —                    | —                         |
| —    | `ipAddress` | `TEXT`          |      Yes | —                    | —                         |
| —    | `createdAt` | `TIMESTAMP(3)`  |       No | `CURRENT_TIMESTAMP`  | —                         |

**Foreign keys**

- `userId` → `User.id`; optional parent; on delete SET NULL, on update CASCADE.

**Unique constraints and indexes**

- Index `AuditLog_entity_createdAt_idx (entity, createdAt)`.

**Relationships**

- Belongs to `User` through `userId` (zero or one parent).

**Business rules represented or inferred**

- User attribution is retained as null after user deletion.
- entity/entityId is a polymorphic reference without a foreign key.

## Database review and recommendations

The following items are recommendations based on the current schema. They are not existing constraints and were not applied.

### Integrity and business-rule gaps

1. **SEO ownership exclusivity.** `Seo` permits zero or several owner foreign keys on one row. If every SEO row must belong to exactly one content record, add a check such as `num_nonnulls("pageId", "serviceId", "trainingId", "articleId", "caseStudyId") = 1`.
2. **Temporal validity.** Add checks for `Event.endAt > Event.startAt`; consider equivalent slot validation for appointments if an end time is later introduced.
3. **Numeric ranges.** Consider checks for non-negative `Event.capacity`, `Training.priceCents`, `CaseStudy.teamSize`, and media dimensions/size; constrain `Testimonial.rating` to the intended scale, commonly 1–5.
4. **Article self-relations.** Add `fromId <> toId` if an article must not relate to itself. Decide whether reverse pairs are distinct; the current directed composite key allows both A→B and B→A.
5. **Event capacity.** The database prevents duplicate email registrations per event, but it does not enforce capacity. Capacity-safe registration requires a transaction/locking strategy or an atomic counter.
6. **Email identity.** PostgreSQL `TEXT` uniqueness is case-sensitive. If email identity is case-insensitive, normalize on write or use `citext`/functional unique indexes for `User`, `NewsletterSubscriber`, and `EventRegistration`.
7. **Categorization rules.** Service, training, and article category foreign keys are nullable. This correctly permits uncategorized records; make them required only if the product requires categorization.
8. **Polymorphic audit target.** `AuditLog.entity` + `entityId` intentionally cannot use a normal foreign key. Validate supported entity names in the application, or replace this pair with explicit relationships if strict referential integrity becomes necessary.

No SQL `CHECK` constraints are present in the reviewed migrations.

### Index review

Foreign-key columns without a supporting index whose leading column is the FK:

- `User.roleId`
- `Account.userId`
- `Session.userId`
- `RolePermission.permissionId`
- `Service.categoryId`
- `Training.categoryId`
- `Article.categoryId`
- `Article.authorId`
- `ArticleTag.tagId`
- `ArticleRelation.toId`
- `CaseStudy.serviceId`
- `Appointment.assignedConsultantId`
- `MenuItem.parentId`
- `AuditLog.userId`

PostgreSQL does not automatically index referencing foreign-key columns. Add indexes according to real query plans and delete/update workload, especially for the list above. Additional likely query candidates include:

- `AnalyticsEvent(path, createdAt)` and `AnalyticsEvent(sessionId, createdAt)` for traffic analysis.
- `AuditLog(userId, createdAt)`, `AuditLog(action, createdAt)`, and optionally `AuditLog(entity, entityId)`.
- `ContactRequest(email, createdAt)`.
- `Appointment(email, requestedAt)` and `Appointment(assignedConsultantId, requestedAt)`.
- `EventRegistration(email)` when looking up registrations across events.
- Full-text or trigram indexes for public content search, if required.

Measure before adding every suggested index: indexes improve reads and referential checks but increase write cost and storage.

### Referential-action risks

- Cascading deletion of a `User` removes OAuth `Account` and `Session` rows, which is appropriate for authentication cleanup.
- Cascading deletion of an `Event` removes all `EventRegistration` rows. Confirm this matches retention and reporting policy.
- Cascading deletion in the recursive `MenuItem` hierarchy removes the whole descendant subtree.
- Deleting an article removes article-tag assignments and both incoming and outgoing article-relation rows.
- Category and optional ownership links generally use `SET NULL`, preserving dependent content.
- If registrations, appointments, contacts, or audit data have legal retention requirements, prefer archival/status transitions over destructive deletion.

### Naming and consistency

- Quoted PascalCase table names require quoted identifiers in handwritten SQL.
- OAuth columns `provider_account_id`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `id_token`, and `session_state` use snake_case while most columns use camelCase. This is functional but should be documented for raw SQL consumers.
- `Session.sessionToken` is both the primary key and separately unique; the unique constraint/index is redundant because a primary key is already unique.
- `VerificationToken.token` is individually unique in addition to the composite primary key `(identifier, token)`; this makes a token globally unique, which is stricter than the primary key alone.

### Auditability and lifecycle consistency

Several relationship/configuration tables do not have timestamps: `Permission`, `RolePermission`, `Account`, `Session`, `VerificationToken`, `TrainingCategory`, `ArticleCategory`, `Tag`, `ArticleTag`, `ArticleRelation`, and `MenuItem`. `NewsletterSubscriber` has `createdAt` but no `updatedAt`. Add timestamps only where historical traceability or operational debugging needs them.

Status/active fields provide selective lifecycle control, but there is no uniform soft-delete convention. Define retention and deletion rules before production data accumulates.

### Type and operational considerations

- `TIMESTAMP(3)` is timestamp without time zone in PostgreSQL. For scheduled events and appointments across time zones, `timestamptz` plus explicit display-zone handling is safer.
- CUID primary-key generation and Prisma `@updatedAt` behavior are application-managed rather than database defaults. Direct SQL writers must supply IDs and maintain update timestamps themselves.
- JSONB and text-array fields are suitable for flexible CMS payloads, but their internal shape is not constrained by foreign keys. Validate them in the application and consider JSON Schema checks if multiple writers are introduced.
- Content tables have locale-aware slug uniqueness, but there is no database-level full-text search design.
- There is no migration-level row-level security. Enforce authorization in the application or add PostgreSQL policies if direct multi-tenant access is introduced.

## Deliverables

- `database-erd.puml`: full PlantUML crow’s-foot ERD with domain packages and all physical attributes.
- `database-erd.mmd`: Mermaid ER diagram containing the same tables and foreign-key cardinalities.
- `database-schema.dbml`: importable DBML schema with table groups, enums, keys, indexes, references, and referential actions.
- `database-erd.svg` and `database-erd.png`: rendered PlantUML outputs when a renderer is available.
- This file: detailed table/column dictionary and architecture review.
