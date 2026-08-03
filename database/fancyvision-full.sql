--
-- PostgreSQL database dump
--

\restrict l4YFnzb2yhRupOQicohCQM4O75sghNuSFmFFe4I6yEQuZZpCMbLwdGdPfL9x2z9

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public."Training" DROP CONSTRAINT IF EXISTS "Training_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Service" DROP CONSTRAINT IF EXISTS "Service_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."Seo" DROP CONSTRAINT IF EXISTS "Seo_trainingId_fkey";
ALTER TABLE IF EXISTS ONLY public."Seo" DROP CONSTRAINT IF EXISTS "Seo_serviceId_fkey";
ALTER TABLE IF EXISTS ONLY public."Seo" DROP CONSTRAINT IF EXISTS "Seo_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."Seo" DROP CONSTRAINT IF EXISTS "Seo_caseStudyId_fkey";
ALTER TABLE IF EXISTS ONLY public."Seo" DROP CONSTRAINT IF EXISTS "Seo_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."Section" DROP CONSTRAINT IF EXISTS "Section_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public."RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_permissionId_fkey";
ALTER TABLE IF EXISTS ONLY public."MenuItem" DROP CONSTRAINT IF EXISTS "MenuItem_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."MenuItem" DROP CONSTRAINT IF EXISTS "MenuItem_menuId_fkey";
ALTER TABLE IF EXISTS ONLY public."EventRegistration" DROP CONSTRAINT IF EXISTS "EventRegistration_eventId_fkey";
ALTER TABLE IF EXISTS ONLY public."CaseStudy" DROP CONSTRAINT IF EXISTS "CaseStudy_serviceId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleTag" DROP CONSTRAINT IF EXISTS "ArticleTag_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleTag" DROP CONSTRAINT IF EXISTS "ArticleTag_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleRelation" DROP CONSTRAINT IF EXISTS "ArticleRelation_toId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleRelation" DROP CONSTRAINT IF EXISTS "ArticleRelation_fromId_fkey";
ALTER TABLE IF EXISTS ONLY public."Appointment" DROP CONSTRAINT IF EXISTS "Appointment_assignedConsultantId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
DROP INDEX IF EXISTS public."VerificationToken_token_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Training_status_order_idx";
DROP INDEX IF EXISTS public."Training_locale_slug_key";
DROP INDEX IF EXISTS public."TrainingCategory_slug_key";
DROP INDEX IF EXISTS public."Tag_slug_key";
DROP INDEX IF EXISTS public."Setting_key_key";
DROP INDEX IF EXISTS public."Session_sessionToken_key";
DROP INDEX IF EXISTS public."Service_status_order_idx";
DROP INDEX IF EXISTS public."Service_locale_slug_key";
DROP INDEX IF EXISTS public."ServiceCategory_slug_key";
DROP INDEX IF EXISTS public."Seo_trainingId_key";
DROP INDEX IF EXISTS public."Seo_serviceId_key";
DROP INDEX IF EXISTS public."Seo_pageId_key";
DROP INDEX IF EXISTS public."Seo_caseStudyId_key";
DROP INDEX IF EXISTS public."Seo_articleId_key";
DROP INDEX IF EXISTS public."Section_pageId_order_idx";
DROP INDEX IF EXISTS public."Role_name_key";
DROP INDEX IF EXISTS public."Redirect_source_key";
DROP INDEX IF EXISTS public."Permission_key_key";
DROP INDEX IF EXISTS public."Page_status_publishedAt_idx";
DROP INDEX IF EXISTS public."Page_locale_slug_key";
DROP INDEX IF EXISTS public."NewsletterSubscriber_email_key";
DROP INDEX IF EXISTS public."Menu_location_locale_key";
DROP INDEX IF EXISTS public."MenuItem_menuId_order_idx";
DROP INDEX IF EXISTS public."Media_key_key";
DROP INDEX IF EXISTS public."Event_status_startAt_idx";
DROP INDEX IF EXISTS public."Event_slug_key";
DROP INDEX IF EXISTS public."EventRegistration_eventId_email_key";
DROP INDEX IF EXISTS public."EventRegistration_eventId_createdAt_idx";
DROP INDEX IF EXISTS public."ContactRequest_status_createdAt_idx";
DROP INDEX IF EXISTS public."CaseStudy_status_publishedAt_idx";
DROP INDEX IF EXISTS public."CaseStudy_locale_slug_key";
DROP INDEX IF EXISTS public."AuditLog_entity_createdAt_idx";
DROP INDEX IF EXISTS public."Article_status_publishedAt_idx";
DROP INDEX IF EXISTS public."Article_locale_slug_key";
DROP INDEX IF EXISTS public."ArticleCategory_slug_key";
DROP INDEX IF EXISTS public."Appointment_status_preferredDate_idx";
DROP INDEX IF EXISTS public."AnalyticsEvent_name_createdAt_idx";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."VerificationToken" DROP CONSTRAINT IF EXISTS "VerificationToken_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Training" DROP CONSTRAINT IF EXISTS "Training_pkey";
ALTER TABLE IF EXISTS ONLY public."TrainingCategory" DROP CONSTRAINT IF EXISTS "TrainingCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."Testimonial" DROP CONSTRAINT IF EXISTS "Testimonial_pkey";
ALTER TABLE IF EXISTS ONLY public."TeamMember" DROP CONSTRAINT IF EXISTS "TeamMember_pkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_pkey";
ALTER TABLE IF EXISTS ONLY public."Setting" DROP CONSTRAINT IF EXISTS "Setting_pkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_pkey";
ALTER TABLE IF EXISTS ONLY public."Service" DROP CONSTRAINT IF EXISTS "Service_pkey";
ALTER TABLE IF EXISTS ONLY public."ServiceCategory" DROP CONSTRAINT IF EXISTS "ServiceCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."Seo" DROP CONSTRAINT IF EXISTS "Seo_pkey";
ALTER TABLE IF EXISTS ONLY public."Section" DROP CONSTRAINT IF EXISTS "Section_pkey";
ALTER TABLE IF EXISTS ONLY public."Role" DROP CONSTRAINT IF EXISTS "Role_pkey";
ALTER TABLE IF EXISTS ONLY public."RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_pkey";
ALTER TABLE IF EXISTS ONLY public."Redirect" DROP CONSTRAINT IF EXISTS "Redirect_pkey";
ALTER TABLE IF EXISTS ONLY public."Permission" DROP CONSTRAINT IF EXISTS "Permission_pkey";
ALTER TABLE IF EXISTS ONLY public."Page" DROP CONSTRAINT IF EXISTS "Page_pkey";
ALTER TABLE IF EXISTS ONLY public."NewsletterSubscriber" DROP CONSTRAINT IF EXISTS "NewsletterSubscriber_pkey";
ALTER TABLE IF EXISTS ONLY public."Menu" DROP CONSTRAINT IF EXISTS "Menu_pkey";
ALTER TABLE IF EXISTS ONLY public."MenuItem" DROP CONSTRAINT IF EXISTS "MenuItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Media" DROP CONSTRAINT IF EXISTS "Media_pkey";
ALTER TABLE IF EXISTS ONLY public."Faq" DROP CONSTRAINT IF EXISTS "Faq_pkey";
ALTER TABLE IF EXISTS ONLY public."Event" DROP CONSTRAINT IF EXISTS "Event_pkey";
ALTER TABLE IF EXISTS ONLY public."EventRegistration" DROP CONSTRAINT IF EXISTS "EventRegistration_pkey";
ALTER TABLE IF EXISTS ONLY public."ContactRequest" DROP CONSTRAINT IF EXISTS "ContactRequest_pkey";
ALTER TABLE IF EXISTS ONLY public."CaseStudy" DROP CONSTRAINT IF EXISTS "CaseStudy_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleTag" DROP CONSTRAINT IF EXISTS "ArticleTag_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleRelation" DROP CONSTRAINT IF EXISTS "ArticleRelation_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleCategory" DROP CONSTRAINT IF EXISTS "ArticleCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."Appointment" DROP CONSTRAINT IF EXISTS "Appointment_pkey";
ALTER TABLE IF EXISTS ONLY public."AnalyticsEvent" DROP CONSTRAINT IF EXISTS "AnalyticsEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."VerificationToken";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TrainingCategory";
DROP TABLE IF EXISTS public."Training";
DROP TABLE IF EXISTS public."Testimonial";
DROP TABLE IF EXISTS public."TeamMember";
DROP TABLE IF EXISTS public."Tag";
DROP TABLE IF EXISTS public."Setting";
DROP TABLE IF EXISTS public."Session";
DROP TABLE IF EXISTS public."ServiceCategory";
DROP TABLE IF EXISTS public."Service";
DROP TABLE IF EXISTS public."Seo";
DROP TABLE IF EXISTS public."Section";
DROP TABLE IF EXISTS public."RolePermission";
DROP TABLE IF EXISTS public."Role";
DROP TABLE IF EXISTS public."Redirect";
DROP TABLE IF EXISTS public."Permission";
DROP TABLE IF EXISTS public."Page";
DROP TABLE IF EXISTS public."NewsletterSubscriber";
DROP TABLE IF EXISTS public."MenuItem";
DROP TABLE IF EXISTS public."Menu";
DROP TABLE IF EXISTS public."Media";
DROP TABLE IF EXISTS public."Faq";
DROP TABLE IF EXISTS public."EventRegistration";
DROP TABLE IF EXISTS public."Event";
DROP TABLE IF EXISTS public."ContactRequest";
DROP TABLE IF EXISTS public."CaseStudy";
DROP TABLE IF EXISTS public."AuditLog";
DROP TABLE IF EXISTS public."ArticleTag";
DROP TABLE IF EXISTS public."ArticleRelation";
DROP TABLE IF EXISTS public."ArticleCategory";
DROP TABLE IF EXISTS public."Article";
DROP TABLE IF EXISTS public."Appointment";
DROP TABLE IF EXISTS public."AnalyticsEvent";
DROP TABLE IF EXISTS public."Account";
DROP TYPE IF EXISTS public."UserStatus";
DROP TYPE IF EXISTS public."RequestStatus";
DROP TYPE IF EXISTS public."MenuLocation";
DROP TYPE IF EXISTS public."Difficulty";
DROP TYPE IF EXISTS public."ContentStatus";
--
-- Name: ContentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ContentStatus" AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'PUBLISHED',
    'ARCHIVED'
);


--
-- Name: Difficulty; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Difficulty" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'ALL_LEVELS'
);


--
-- Name: MenuLocation; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MenuLocation" AS ENUM (
    'HEADER',
    'FOOTER'
);


--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'COMPLETED',
    'SPAM',
    'ARCHIVED'
);


--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INVITED',
    'SUSPENDED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Account" (
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: AnalyticsEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AnalyticsEvent" (
    id text NOT NULL,
    name text NOT NULL,
    path text,
    "sessionId" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Appointment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Appointment" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    "preferredDate" timestamp(3) without time zone,
    topic text,
    message text,
    status public."RequestStatus" DEFAULT 'NEW'::public."RequestStatus" NOT NULL,
    "assignedConsultantId" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Article; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    "categoryId" text,
    "authorId" text,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content jsonb NOT NULL,
    "coverImage" text,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    "readingTime" integer DEFAULT 5 NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "scheduledFor" timestamp(3) without time zone,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ArticleCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ArticleCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text
);


--
-- Name: ArticleRelation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ArticleRelation" (
    "fromId" text NOT NULL,
    "toId" text NOT NULL
);


--
-- Name: ArticleTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ArticleTag" (
    "articleId" text NOT NULL,
    "tagId" text NOT NULL
);


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    before jsonb,
    after jsonb,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CaseStudy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CaseStudy" (
    id text NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    "serviceId" text,
    title text NOT NULL,
    slug text NOT NULL,
    company text NOT NULL,
    "companyLogo" text,
    sector text,
    "teamSize" integer,
    excerpt text NOT NULL,
    before text NOT NULL,
    after text NOT NULL,
    content jsonb NOT NULL,
    metrics jsonb NOT NULL,
    gallery text[],
    "coverImage" text,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ContactRequest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContactRequest" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    subject text,
    message text NOT NULL,
    status public."RequestStatus" DEFAULT 'NEW'::public."RequestStatus" NOT NULL,
    "replyStatus" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    audience text NOT NULL,
    location text NOT NULL,
    host text NOT NULL,
    "startAt" timestamp(3) without time zone NOT NULL,
    "endAt" timestamp(3) without time zone,
    image text,
    capacity integer,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EventRegistration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EventRegistration" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    message text,
    status public."RequestStatus" DEFAULT 'NEW'::public."RequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Faq" (
    id text NOT NULL,
    category text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    key text,
    "mimeType" text NOT NULL,
    size integer NOT NULL,
    width integer,
    height integer,
    alt text NOT NULL,
    folder text DEFAULT '/'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Menu" (
    id text NOT NULL,
    name text NOT NULL,
    location public."MenuLocation" NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MenuItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MenuItem" (
    id text NOT NULL,
    "menuId" text NOT NULL,
    "parentId" text,
    label text NOT NULL,
    url text NOT NULL,
    external boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL
);


--
-- Name: NewsletterSubscriber; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NewsletterSubscriber" (
    id text NOT NULL,
    email text NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    source text,
    "confirmedAt" timestamp(3) without time zone,
    "unsubscribedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Page" (
    id text NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    eyebrow text,
    headline text,
    description text,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    key text NOT NULL,
    description text
);


--
-- Name: Redirect; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Redirect" (
    id text NOT NULL,
    source text NOT NULL,
    target text NOT NULL,
    permanent boolean DEFAULT true NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


--
-- Name: Section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Section" (
    id text NOT NULL,
    "pageId" text NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    data jsonb NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Seo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Seo" (
    id text NOT NULL,
    "pageId" text,
    "serviceId" text,
    "trainingId" text,
    "articleId" text,
    "caseStudyId" text,
    title text NOT NULL,
    description text NOT NULL,
    keywords text[],
    canonical text,
    "ogImage" text,
    schema jsonb,
    "noIndex" boolean DEFAULT false NOT NULL
);


--
-- Name: Service; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    "categoryId" text,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content jsonb NOT NULL,
    icon text,
    image text,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ServiceCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ServiceCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Setting" (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    "group" text DEFAULT 'general'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL
);


--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TeamMember" (
    id text NOT NULL,
    name text NOT NULL,
    "position" text NOT NULL,
    biography text NOT NULL,
    picture text,
    linkedin text,
    social jsonb,
    "order" integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Testimonial; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Testimonial" (
    id text NOT NULL,
    name text NOT NULL,
    company text,
    "position" text,
    quote text NOT NULL,
    avatar text,
    rating integer DEFAULT 5 NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Training; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Training" (
    id text NOT NULL,
    locale text DEFAULT 'fr'::text NOT NULL,
    "categoryId" text,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content jsonb NOT NULL,
    objectives text[],
    audience text[],
    modules jsonb NOT NULL,
    "priceCents" integer,
    duration text,
    image text,
    "pdfUrl" text,
    instructor text,
    difficulty public."Difficulty" DEFAULT 'ALL_LEVELS'::public."Difficulty" NOT NULL,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TrainingCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TrainingCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "passwordHash" text,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "roleId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Account" ("userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: AnalyticsEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AnalyticsEvent" (id, name, path, "sessionId", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Appointment" (id, name, email, phone, company, "preferredDate", topic, message, status, "assignedConsultantId", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Article" (id, locale, "categoryId", "authorId", title, slug, excerpt, content, "coverImage", status, "readingTime", featured, "scheduledFor", "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmsc9j0nn003mv71sjgwqy6x0	fr	cmsc9j0mr003ev71sudg0hi7y	cmsc9j08f0008v71s8fepzd0i	Créer une mindmap de projet avec Claude	claude-mindmap-projet	Créer une mindmap de projet avec Claude : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	t	\N	2026-07-31 03:08:27.245	2026-08-02 20:38:33.491	2026-08-03 03:08:27.403
cmsc9j0nu003ov71sawiqqfh9	fr	cmsc9j0mv003fv71s1owxfij7	cmsc9j08f0008v71s8fepzd0i	Comprendre l’IA : les définitions essentielles	comprendre-ia-definitions	Comprendre l’IA : les définitions essentielles : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-data-systems.webp	PUBLISHED	6	t	\N	2026-07-28 03:08:27.245	2026-08-02 20:38:33.498	2026-08-03 03:08:27.409
cmsc9j0nf003kv71s65ey0lcu	fr	cmsc9j0n0003gv71sbybh7v40	cmsc9j08f0008v71s8fepzd0i	Analyser un PDF avec NotebookLM	analyse-pdf-notebooklm	Analyser un PDF avec NotebookLM : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-ai-strategy.webp	PUBLISHED	6	t	\N	2026-08-03 03:08:27.245	2026-08-02 20:38:33.483	2026-08-03 03:08:27.395
cmsc9j0oh003uv71szszg3w7y	fr	cmsc9j0n9003iv71sbco5nrgz	cmsc9j08f0008v71s8fepzd0i	Mieux écrire ses e-mails avec ChatGPT	ecrire-emails-chatgpt	Mieux écrire ses e-mails avec ChatGPT : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-07-19 03:08:27.245	2026-08-02 20:38:33.521	2026-08-03 03:08:27.428
cmsc9j0ow003yv71sp738mg9o	fr	cmsc9j0n0003gv71sbybh7v40	cmsc9j08f0008v71s8fepzd0i	Pourquoi former les équipes d’une PME à l’IA ?	formation-ia-pme	Pourquoi former les équipes d’une PME à l’IA ? : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-07-13 03:08:27.245	2026-08-02 20:38:33.536	2026-08-03 03:08:27.442
cmsc9j0ob003sv71smke65w39	fr	cmsc9j0mm003dv71svhm0bwz0	cmsc9j08f0008v71s8fepzd0i	Créer des images avec ChatGPT	creer-images-reseaux-sociaux-chatgpt	Créer des images avec ChatGPT : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-ai-strategy.webp	PUBLISHED	6	f	\N	2026-07-22 03:08:27.245	2026-08-02 20:38:33.515	2026-08-03 03:08:27.422
cmsc9j0ph0044v71scb6ie4l9	fr	cmsc9j0mv003fv71s1owxfij7	cmsc9j08f0008v71s8fepzd0i	Quelle IA choisir pour protéger ses données ?	ia-la-plus-securisee	Quelle IA choisir pour protéger ses données ? : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-data-systems.webp	PUBLISHED	6	f	\N	2026-07-04 03:08:27.245	2026-08-02 20:38:33.557	2026-08-03 03:08:27.46
cmsc9j0pw0048v71sae8d9ra7	fr	cmsc9j0mm003dv71svhm0bwz0	cmsc9j08f0008v71s8fepzd0i	ChatGPT et sécurité des données	ia-securite-chatgpt-donnees	ChatGPT et sécurité des données : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-ai-strategy.webp	PUBLISHED	6	f	\N	2026-06-28 03:08:27.245	2026-08-02 20:38:33.573	2026-08-03 03:08:27.472
cmsc9j0oo003wv71ssj86a4hh	fr	cmsc9j0n0003gv71sbybh7v40	cmsc9j08f0008v71s8fepzd0i	Comment financer une formation en IA ?	financement-formation-ia	Comment financer une formation en IA ? : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-data-systems.webp	PUBLISHED	6	f	\N	2026-07-16 03:08:27.245	2026-08-02 20:38:33.528	2026-08-03 03:08:27.436
cmsc9j0p90042v71sbx4dns4q	fr	cmsc9j0mi003cv71sxeskf0ef	cmsc9j08f0008v71s8fepzd0i	L’IA au service des ressources humaines	ia-drh	L’IA au service des ressources humaines : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-07-07 03:08:27.245	2026-08-02 20:38:33.549	2026-08-03 03:08:27.455
cmsc9j0qo004gv71sggx0j1iw	fr	cmsc9j0mv003fv71s1owxfij7	cmsc9j08f0008v71s8fepzd0i	Prévenir les risques de l’IA en entreprise	risques-ia-entreprise-incidents	Prévenir les risques de l’IA en entreprise : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-06-19 03:08:27.245	2026-08-02 20:38:33.6	2026-08-03 03:08:27.49
cmsc9j0po0046v71s6d7yja56	fr	cmsc9j0mv003fv71s1owxfij7	cmsc9j08f0008v71s8fepzd0i	L’IA et le marché de l’emploi en France	ia-marche-emploi-france	L’IA et le marché de l’emploi en France : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-07-01 03:08:27.245	2026-08-02 20:38:33.564	2026-08-03 03:08:27.465
cmsc9j0q3004av71sar46d9nw	fr	cmsc9j0mm003dv71svhm0bwz0	cmsc9j08f0008v71s8fepzd0i	Introduction à l’intelligence artificielle	introduction-intelligence-artificielle-chatgpt	Introduction à l’intelligence artificielle : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-06-25 03:08:27.245	2026-08-02 20:38:33.579	2026-08-03 03:08:27.477
cmsc9j0qg004ev71sch0wbhpi	fr	cmsc9j0n5003hv71spjm8iyua	cmsc9j08f0008v71s8fepzd0i	Transformer la méfiance en curiosité	peur-mefiance-ia	Transformer la méfiance en curiosité : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-data-systems.webp	PUBLISHED	6	f	\N	2026-06-22 03:08:27.245	2026-08-02 20:38:33.592	2026-08-03 03:08:27.483
cmsc9j0r9004mv71sdzdggykd	fr	cmsc9j0n0003gv71sbybh7v40	cmsc9j08f0008v71s8fepzd0i	Faciliter la veille juridique avec l’IA	veille-juridique-notaires	Faciliter la veille juridique avec l’IA : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-data-systems.webp	PUBLISHED	6	f	\N	2026-06-10 03:08:27.245	2026-08-02 20:38:33.621	2026-08-03 03:08:27.507
cmsc9j0o4003qv71sonmu5k25	fr	cmsc9j0n9003iv71sbco5nrgz	cmsc9j08f0008v71s8fepzd0i	Automatiser ses comptes rendus de réunion avec l’IA	comptes-rendus-reunion-ia	Automatiser ses comptes rendus de réunion avec l’IA : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-07-25 03:08:27.245	2026-08-02 20:38:33.508	2026-08-03 03:08:27.415
cmsc9j0p20040v71srvedrsxv	fr	cmsc9j0mv003fv71s1owxfij7	cmsc9j08f0008v71s8fepzd0i	IA et consommation énergétique	ia-consommation-energetique	IA et consommation énergétique : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-ai-strategy.webp	PUBLISHED	6	f	\N	2026-07-10 03:08:27.245	2026-08-02 20:38:33.543	2026-08-03 03:08:27.447
cmsc9j0qv004iv71s8eqcpko7	fr	cmsc9j0n9003iv71sbco5nrgz	cmsc9j08f0008v71s8fepzd0i	Améliorer le service client avec les chatbots	service-client-chatbot-ia	Améliorer le service client avec les chatbots : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-ai-strategy.webp	PUBLISHED	6	f	\N	2026-06-16 03:08:27.245	2026-08-02 20:38:33.608	2026-08-03 03:08:27.494
cmsc9j0r2004kv71s977cpgv9	fr	cmsc9j0n5003hv71spjm8iyua	cmsc9j08f0008v71s8fepzd0i	Du prompt au contexte	tribune-du-prompt-au-contexte	Du prompt au contexte : objectifs, méthode et bonnes pratiques pour passer de la curiosité à un usage concret de l’intelligence artificielle.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’intelligence artificielle transforme les façons de chercher, produire, analyser et décider. Pour en tirer de la valeur, il faut partir d’un objectif clair.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Commencer par un objectif concret", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Définissez le résultat attendu, les données disponibles et les critères qui permettront de juger la qualité du travail produit.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Adopter une méthode simple", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choisir un cas d’usage précis et fréquent", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Tester avec des données non sensibles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Comparer le résultat à votre méthode actuelle", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Documenter les prompts et les bonnes pratiques", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Garder l’humain dans la boucle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les réponses doivent rester relues, vérifiées et contextualisées par une personne compétente, en particulier pour les décisions sensibles.", "type": "text"}]}]}	/images/fancyvision-training.webp	PUBLISHED	6	f	\N	2026-06-13 03:08:27.245	2026-08-02 20:38:33.614	2026-08-03 03:08:27.5
\.


--
-- Data for Name: ArticleCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ArticleCategory" (id, name, slug, description) FROM stdin;
cmsc9j0ar000qv71s0ujczk0w	Guides pratiques	guides-pratiques	Des méthodes concrètes pour mieux travailler avec l’IA.
cmsc9j0b2000rv71sq1ac4uc8	Études & analyses	etudes-analyses	Décryptages et tendances de l’intelligence artificielle.
cmsc9j0mi003cv71sxeskf0ef	Actualité	actualite	Articles, méthodes et analyses FancyVision sur le thème « Actualité ».
cmsc9j0mm003dv71svhm0bwz0	ChatGPT	chatgpt	Articles, méthodes et analyses FancyVision sur le thème « ChatGPT ».
cmsc9j0mr003ev71sudg0hi7y	Claude	claude	Articles, méthodes et analyses FancyVision sur le thème « Claude ».
cmsc9j0mv003fv71s1owxfij7	Études et analyses	etudes-et-analyses	Articles, méthodes et analyses FancyVision sur le thème « Études et analyses ».
cmsc9j0n0003gv71sbybh7v40	Guide pratiques	guide-pratiques	Articles, méthodes et analyses FancyVision sur le thème « Guide pratiques ».
cmsc9j0n5003hv71spjm8iyua	Opinions	opinions	Articles, méthodes et analyses FancyVision sur le thème « Opinions ».
cmsc9j0n9003iv71sbco5nrgz	Productivité	productivite	Articles, méthodes et analyses FancyVision sur le thème « Productivité ».
\.


--
-- Data for Name: ArticleRelation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ArticleRelation" ("fromId", "toId") FROM stdin;
\.


--
-- Data for Name: ArticleTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ArticleTag" ("articleId", "tagId") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, "userId", action, entity, "entityId", before, after, "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: CaseStudy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CaseStudy" (id, locale, "serviceId", title, slug, company, "companyLogo", sector, "teamSize", excerpt, before, after, content, metrics, gallery, "coverImage", status, featured, "publishedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContactRequest; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContactRequest" (id, name, email, phone, company, subject, message, status, "replyStatus", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Event" (id, slug, title, description, type, audience, location, host, "startAt", "endAt", image, capacity, status, "createdAt", "updatedAt") FROM stdin;
cmscatwx2005jv7ekhi7kzpcm	booster-paris	IA Booster — session intensive	Une session concrète pour découvrir les usages, méthodes et outils qui permettent de déployer l’IA dans votre organisation.	Formation FancyVision	Entreprise	Paris · La Boétie	Équipe FancyVision	2026-08-05 17:00:00	2026-08-05 19:00:00	/images/fancyvision-events.webp	30	PUBLISHED	2026-08-02 21:15:01.478	2026-08-03 03:08:27.661
cmscatwxc005kv7eky7zwz1k9	conference-agents	Agents IA : de l’idée au premier workflow	Un atelier accessible et pratique pour découvrir de nouveaux usages de l’IA, poser vos questions et progresser avec nos experts.	FancyVision Lab	Ouvert à tous	En ligne	FancyVision Lab	2026-08-11 14:00:00	2026-08-11 16:00:00	/images/fancyvision-events.webp	30	PUBLISHED	2026-08-02 21:15:01.488	2026-08-03 03:08:27.668
cmscatwxh005lv7ekyi4fgqsk	performer-lyon	IA Performer — niveau avancé	Une session concrète pour découvrir les usages, méthodes et outils qui permettent de déployer l’IA dans votre organisation.	Formation FancyVision	Entreprise	Lyon	Équipe FancyVision	2026-08-18 08:00:00	2026-08-18 10:00:00	/images/fancyvision-events.webp	30	PUBLISHED	2026-08-02 21:15:01.493	2026-08-03 03:08:27.674
cmscatwxn005mv7ekxi7knhyl	productivite-online	Atelier IA Productivité	Un atelier accessible et pratique pour découvrir de nouveaux usages de l’IA, poser vos questions et progresser avec nos experts.	Atelier en direct	Particuliers	En ligne	FancyVision Academy	2026-08-26 13:00:00	2026-08-26 15:00:00	/images/fancyvision-events.webp	30	PUBLISHED	2026-08-02 21:15:01.499	2026-08-03 03:08:27.677
cmscatwxs005nv7ekw0fvuwzp	vente-bordeaux	IA Vente — prospecter avec méthode	Un atelier accessible et pratique pour découvrir de nouveaux usages de l’IA, poser vos questions et progresser avec nos experts.	Formation FancyVision	Particuliers	Bordeaux	FancyVision Academy	2026-09-03 08:00:00	2026-09-03 10:00:00	/images/fancyvision-events.webp	30	PUBLISHED	2026-08-02 21:15:01.504	2026-08-03 03:08:27.68
cmscatwxx005ov7ekc14oxx5p	ai-breakfast	Petit-déjeuner des décideurs IA	Une session concrète pour découvrir les usages, méthodes et outils qui permettent de déployer l’IA dans votre organisation.	Rencontre privée	Entreprise	Paris	FancyVision Conseil	2026-09-12 07:00:00	2026-09-12 09:00:00	/images/fancyvision-events.webp	30	PUBLISHED	2026-08-02 21:15:01.509	2026-08-03 03:08:27.685
\.


--
-- Data for Name: EventRegistration; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EventRegistration" (id, "eventId", name, email, phone, company, message, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Faq; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Faq" (id, category, question, answer, "order", visible, "createdAt", "updatedAt") FROM stdin;
cmsc9j0tj0051v71srqwakhnb	Général	Quand voit-on les premiers résultats ?	Les premiers gains apparaissent souvent dès les jours suivant la formation. Un audit complet dure généralement quatre à six semaines.	2	t	2026-08-02 20:38:33.704	2026-08-03 03:08:27.547
cmsc9j0to0052v71s8lel9ctc	Général	Comment mesurez-vous les résultats ?	Nous suivons l’adoption, le temps gagné, la qualité produite et la satisfaction des participants.	3	t	2026-08-02 20:38:33.709	2026-08-03 03:08:27.554
cmsc9j0ca0012v71sc43dh2ar	Général	Quelle est la meilleure manière de commencer avec l’IA générative ?	Commencez par un diagnostic court de vos processus et de vos données. Il permet d’identifier les gains rapides, les risques et le niveau de formation nécessaire avant d’investir davantage.	0	f	2026-08-02 20:38:33.082	2026-08-03 03:08:27.528
cmsc9j0cg0013v71swmqecnun	Général	Pouvez-vous former plusieurs centaines de collaborateurs ?	Oui. Nous concevons des parcours multi-sites, segmentés par métier, avec formateurs, ambassadeurs internes, ressources pédagogiques et mesure d’adoption.	1	f	2026-08-02 20:38:33.088	2026-08-03 03:08:27.528
cmsc9j0cl0014v71sqa9ailbi	Général	Combien de temps faut-il pour observer des résultats ?	Les gains individuels apparaissent dès les premiers ateliers. Pour un déploiement d’entreprise, les premiers indicateurs significatifs sont généralement visibles en quatre à douze semaines.	2	f	2026-08-02 20:38:33.094	2026-08-03 03:08:27.528
cmsc9j0ct0015v71s6xb9t2n8	Général	Comment protégez-vous les données sensibles ?	Chaque mission intègre une analyse des outils, des flux de données et des droits d’accès. Nous privilégions les environnements professionnels configurés selon vos contraintes SI et RGPD.	3	f	2026-08-02 20:38:33.102	2026-08-03 03:08:27.528
cmsc9j0t3004zv71ss09nvbxk	Général	Comment commencer à intégrer l’IA ?	Commencez par une formation pour créer une culture commune ou par un audit pour cartographier et prioriser les opportunités.	0	t	2026-08-02 20:38:33.688	2026-08-03 03:08:27.536
cmsc9j0ta0050v71s68nrcnav	Général	Pouvez-vous former plusieurs centaines de personnes ?	Oui. Les parcours sont segmentés par métier, niveau, zone géographique et calendrier de déploiement.	1	t	2026-08-02 20:38:33.694	2026-08-03 03:08:27.543
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Media" (id, name, url, key, "mimeType", size, width, height, alt, folder, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Menu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Menu" (id, name, location, locale, "createdAt", "updatedAt") FROM stdin;
cmsc9j0gp0022v71sxpl4xbrd	Navigation principale	HEADER	fr	2026-08-02 20:38:33.241	2026-08-03 03:08:27.697
cmsc9j0hf0028v71s276xz1ki	Navigation pied de page	FOOTER	fr	2026-08-02 20:38:33.267	2026-08-03 03:08:27.71
\.


--
-- Data for Name: MenuItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MenuItem" (id, "menuId", "parentId", label, url, external, "order", visible) FROM stdin;
cmscngfqw0059v7pwt9yixy75	cmsc9j0gp0022v71sxpl4xbrd	\N	Nos services	/services	f	0	t
cmscngfqw005av7pwrx0bi47y	cmsc9j0gp0022v71sxpl4xbrd	\N	Formation	/formations	f	1	t
cmscngfqw005bv7pwyod4n6ag	cmsc9j0gp0022v71sxpl4xbrd	\N	Événements	/evenements	f	2	t
cmscngfqw005cv7pwcjywnqyj	cmsc9j0gp0022v71sxpl4xbrd	\N	À propos	/a-propos	f	3	t
cmscngfr7005ev7pwqnbbt7ei	cmsc9j0hf0028v71s276xz1ki	\N	Services	/services	f	0	t
cmscngfr7005fv7pwff99aofy	cmsc9j0hf0028v71s276xz1ki	\N	Formations	/formations	f	1	t
cmscngfr7005gv7pw2w8sm1c8	cmsc9j0hf0028v71s276xz1ki	\N	Événements	/evenements	f	2	t
cmscngfr7005hv7pwy987iwyb	cmsc9j0hf0028v71s276xz1ki	\N	À propos	/a-propos	f	3	t
cmscngfr7005iv7pwji9k9sgu	cmsc9j0hf0028v71s276xz1ki	\N	Contact	/contact	f	4	t
cmscngfr7005jv7pw0hrv0vqc	cmsc9j0hf0028v71s276xz1ki	\N	Mentions légales	/mentions-legales	f	6	t
cmscngfr7005kv7pwcs8poj7f	cmsc9j0hf0028v71s276xz1ki	\N	Confidentialité	/confidentialite	f	7	t
\.


--
-- Data for Name: NewsletterSubscriber; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."NewsletterSubscriber" (id, email, locale, source, "confirmedAt", "unsubscribedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Page; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Page" (id, locale, title, slug, eyebrow, headline, description, status, "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmsc9j0e8001kv71s318vsn5e	fr	Conseil & Data	services	\N	Transformez vos ambitions en usages concrets.	Audit, gouvernance, intégration, Data Engineering, Business Intelligence et Data Science : choisissez l’accompagnement adapté.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.152	2026-08-03 03:08:27.574
cmsc9j0ed001lv71s2f41atoy	fr	Formations en intelligence artificielle	formation	\N	Formez vos équipes à l’IA.	Des parcours par niveau et par métier, conçus autour de situations réelles, partout en France ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.157	2026-08-03 03:08:27.577
cmsc9j0ei001mv71s346bw5tq	fr	À propos de FancyVision	a-propos	\N	Rendre l’IA accessible, utile et responsable.	FancyVision réunit consultants, formateurs et experts produit pour accompagner les organisations de la compréhension au déploiement.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.162	2026-08-03 03:08:27.581
cmsc9j0f4001pv71s9od9i98v	fr	Contact	contact	\N	Parlons de votre projet.	Décrivez-nous votre contexte. Un consultant vous répond sous un jour ouvré.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.184	2026-08-03 03:08:27.599
cmsc9j0f8001qv71sfygm733z	fr	Mentions légales & confidentialité	mentions-legales	\N	Mentions légales & confidentialité	Informations légales, traitement des données personnelles et propriété intellectuelle.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.189	2026-08-03 03:08:27.605
cmsc9j0vq005pv71spptiudjf	fr	Formation IA à Paris	formation-ia-paris	\N	Formation IA et ChatGPT à Paris	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.782	2026-08-03 03:08:27.62
cmsc9j0vu005qv71sdwj66jmk	fr	Formation IA à Marseille	formation-ia-marseille	\N	Formation IA et ChatGPT à Marseille	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.786	2026-08-03 03:08:27.624
cmsc9j0vz005rv71stnw4xpjh	fr	Formation IA à Lyon	formation-ia-lyon	\N	Formation IA et ChatGPT à Lyon	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.791	2026-08-03 03:08:27.627
cmsc9j0w9005tv71s0w3k7l0p	fr	Formation IA à Nantes	formation-ia-nantes	\N	Formation IA et ChatGPT à Nantes	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.801	2026-08-03 03:08:27.635
cmsc9j0wf005uv71sjoa7hq5g	fr	Formation IA à Montpellier	formation-ia-montpellier	\N	Formation IA et ChatGPT à Montpellier	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.807	2026-08-03 03:08:27.639
cmsc9j0fn001tv71sygj5fd8e	fr	Politique de confidentialité	confidentialite	\N	Politique de confidentialité	Comment FancyVision collecte, utilise et protège vos données personnelles.	PUBLISHED	2026-08-02 20:38:33.202	2026-08-02 20:38:33.204	2026-08-03 03:08:27.176
cmsc9j0fy001wv71s4c5hzksx	fr	Conditions d’utilisation	conditions	\N	Conditions d’utilisation	Les règles d’accès et d’utilisation des services numériques FancyVision.	PUBLISHED	2026-08-02 20:38:33.213	2026-08-02 20:38:33.215	2026-08-03 03:08:27.187
cmsc9j0dq0019v71s9wd31wnn	fr	Conseil, formation et intégration en intelligence artificielle	accueil	Conseil · Formation · Intégration	Donnez une vision claire à vos projets d’IA	FancyVision aide les entreprises, administrations et professionnels à transformer l’intelligence artificielle en usages concrets.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.135	2026-08-03 03:08:27.557
cmsc9j0er001nv71svt7t4nc5	fr	Études de cas	etudes-de-cas	\N	Des transformations visibles sur le terrain.	Découvrez comment nos clients structurent leurs usages, forment leurs équipes et mesurent les résultats.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.171	2026-08-03 03:08:27.587
cmsc9j0ew001ov71s7cwm57j3	fr	Le média FancyVision	blog	\N	Actualités et opinions sur l’IA.	Guides pratiques, analyses et méthodes pour passer de la curiosité à l’usage.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.176	2026-08-03 03:08:27.592
cmsc9j0uz005kv71snj10ofu4	fr	Événements	evenements	\N	Formations, ateliers et événements IA.	Un calendrier unique pour apprendre, rencontrer nos experts et réserver votre prochaine session.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.755	2026-08-03 03:08:27.595
cmsc9j0w3005sv71s6xkghq8j	fr	Formation IA à Lille	formation-ia-lille	\N	Formation IA et ChatGPT à Lille	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.795	2026-08-03 03:08:27.63
cmsc9j0wj005vv71se9i2dwtx	fr	Formation IA à Grenoble	formation-ia-grenoble	\N	Formation IA et ChatGPT à Grenoble	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.811	2026-08-03 03:08:27.643
cmsc9j0wn005wv71st7mdafb6	fr	Formation IA à Clermont-Ferrand	formation-ia-clermont-ferrand	\N	Formation IA et ChatGPT à Clermont-Ferrand	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.816	2026-08-03 03:08:27.645
cmsc9j0ws005xv71st7ewjqc6	fr	Formation IA à Bordeaux	formation-ia-bordeaux	\N	Formation IA et ChatGPT à Bordeaux	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.821	2026-08-03 03:08:27.649
cmsc9j0wy005yv71scpdiajtr	fr	Formation IA à Angers	formation-ia-angers	\N	Formation IA et ChatGPT à Angers	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.826	2026-08-03 03:08:27.654
cmsc9j0x4005zv71syjbt1jjk	fr	Formation IA à Dijon	formation-ia-formations-dijon	\N	Formation IA et ChatGPT à Dijon	Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance.	PUBLISHED	2026-08-03 03:08:27.245	2026-08-02 20:38:33.832	2026-08-03 03:08:27.658
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Permission" (id, key, description) FROM stdin;
cmsc9izwi0001v71shdnc32gx	dashboard.view	Consulter le tableau de bord
cmsc9izx00002v71senvlqhri	content.manage	Gérer tout le contenu
cmsc9izxf0003v71sq5u78hac	blog.manage	Gérer le blog
cmsc9izxq0004v71sge7i82ds	requests.manage	Gérer les demandes
cmsc9izy70005v71sqvj5dojj	users.manage	Gérer les utilisateurs
cmsc9izym0006v71sou0f7kgo	settings.manage	Gérer les paramètres
\.


--
-- Data for Name: Redirect; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Redirect" (id, source, target, permanent, active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Role" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cmsc9izvh0000v71s6wizezx5	Administrateur	Accès complet à FancyVision	2026-08-02 20:38:32.475	2026-08-02 20:38:32.475
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RolePermission" ("roleId", "permissionId") FROM stdin;
cmsc9izvh0000v71s6wizezx5	cmsc9izwi0001v71shdnc32gx
cmsc9izvh0000v71s6wizezx5	cmsc9izx00002v71senvlqhri
cmsc9izvh0000v71s6wizezx5	cmsc9izxf0003v71sq5u78hac
cmsc9izvh0000v71s6wizezx5	cmsc9izxq0004v71sge7i82ds
cmsc9izvh0000v71s6wizezx5	cmsc9izy70005v71sqvj5dojj
cmsc9izvh0000v71s6wizezx5	cmsc9izym0006v71sou0f7kgo
\.


--
-- Data for Name: Section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Section" (id, "pageId", type, name, data, "order", visible, "createdAt", "updatedAt") FROM stdin;
cmsc9j0ft001vv71s0vlvr0ig	cmsc9j0fn001tv71sygj5fd8e	legal	Contenu légal	{"body": {"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Les données transmises via les formulaires sont utilisées uniquement pour répondre à votre demande, gérer un rendez-vous ou vous adresser la newsletter demandée.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "La base légale dépend du service concerné : consentement, mesures précontractuelles ou intérêt légitime. Les données ne sont pas revendues.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos données en écrivant à bonjour@fancyvision.fr.", "type": "text"}]}]}}	0	t	2026-08-02 20:38:33.21	2026-08-03 03:08:27.183
cmsc9j0g5001yv71swmpfcwll	cmsc9j0fy001wv71s4c5hzksx	legal	Contenu légal	{"body": {"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "L’accès au site implique l’acceptation des présentes conditions. Les informations publiées ont une vocation générale et ne constituent pas un conseil juridique ou financier.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "L’utilisateur s’engage à ne pas perturber le fonctionnement du site, détourner ses formulaires ou tenter d’accéder à des espaces protégés.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "FancyVision peut faire évoluer le site et ces conditions à tout moment. Le droit français est applicable.", "type": "text"}]}]}}	0	t	2026-08-02 20:38:33.221	2026-08-03 03:08:27.193
cmscngfn10045v7pwfdl2ugz3	cmsc9j0dq0019v71s9wd31wnn	hero	Hero	{"title": "Donnez une vision claire\\nà vos projets d’IA", "eyebrow": "Conseil · Formation · Intégration", "description": "FancyVision aide les entreprises, administrations et professionnels à transformer l’intelligence artificielle en usages concrets.", "primaryHref": "/rendez-vous", "primaryLabel": "Échangeons sur votre projet", "secondaryHref": "/evenements", "secondaryLabel": "Voir les prochaines sessions"}	0	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn10046v7pwdee423lu	cmsc9j0dq0019v71s9wd31wnn	services-intro	Conseil	{"image": "/images/fancyvision-ai-strategy.webp", "title": "Des projets d’IA\\nclairs et activables", "eyebrow": "Conseil", "categorySlug": "conseil"}	2	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn10047v7pwpkixhdb6	cmsc9j0dq0019v71s9wd31wnn	services-intro	Data	{"image": "/images/fancyvision-data-systems.webp", "title": "Des données fiables,\\nutiles et activables", "eyebrow": "Data", "description": "De la stratégie à la Data Science, FancyVision construit les fondations et les produits qui transforment vos données en décisions.", "categorySlug": "data"}	3	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn10048v7pwd54iy2k6	cmsc9j0dq0019v71s9wd31wnn	split-feature	Formation entreprise	{"image": "/images/fancyvision-training.webp", "title": "Faites grandir les usages dans vos équipes", "ctaHref": "/formations", "eyebrow": "Formation en entreprise", "ctaLabel": "Découvrir les formations", "description": "Des programmes par métier, du COMEX aux équipes opérationnelles, conçus autour de situations réelles."}	4	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn10049v7pwy8pf1nc4	cmsc9j0dq0019v71s9wd31wnn	split-feature	Formation particuliers	{"image": "/images/fancyvision-data-systems.webp", "title": "Développez vos compétences en IA", "ctaHref": "/formations", "eyebrow": "Formation pour particuliers", "reverse": true, "ctaLabel": "Voir les programmes", "description": "Des formations pratiques, des ateliers en ligne et un calendrier de sessions pour apprendre en faisant."}	5	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn1004av7pwz75v19zt	cmsc9j0dq0019v71s9wd31wnn	advantages	Impact	{"items": [{"stats": [{"label": "diagnostic", "value": "01"}, {"label": "périmètre", "value": "Clair"}], "title": "Cadrage", "number": "01", "description": "Nous clarifions le besoin, les contraintes et les critères de réussite avant de construire."}, {"stats": [{"label": "prototype", "value": "02"}, {"label": "itérations", "value": "Agile"}], "title": "Mise en œuvre", "number": "02", "description": "Nous avançons par itérations courtes avec des livrables concrets et faciles à tester."}, {"stats": [{"label": "déploiement", "value": "03"}, {"label": "suivi", "value": "Continu"}], "title": "Sur mesure", "number": "03", "description": "Conseil, formation et intégration réunis dans un même parcours, adapté à votre maturité."}], "title": "Une méthode simple, lisible et adaptée à votre contexte.", "eyebrow": "Notre approche"}	6	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn1004bv7pwihzinz7c	cmsc9j0dq0019v71s9wd31wnn	events-preview	Agenda	{"items": [{"id": "booster-paris", "host": "Équipe FancyVision", "hour": 18, "href": "/formations/ia-booster", "type": "Formation FancyVision", "image": "/images/fancyvision-events.webp", "title": "IA Booster — session intensive", "audience": "Entreprise", "location": "Paris · La Boétie", "offsetDays": 2}, {"id": "conference-agents", "host": "FancyVision Lab", "hour": 15, "href": "/formations/conferences-ia", "type": "FancyVision Lab", "image": "/images/fancyvision-events.webp", "title": "Agents IA : de l’idée au premier workflow", "audience": "Ouvert à tous", "location": "En ligne", "offsetDays": 8}, {"id": "performer-lyon", "host": "Équipe FancyVision", "hour": 9, "href": "/formations/ia-performer", "type": "Formation FancyVision", "image": "/images/fancyvision-events.webp", "title": "IA Performer — niveau avancé", "audience": "Entreprise", "location": "Lyon", "offsetDays": 15}, {"id": "productivite-online", "host": "FancyVision Academy", "hour": 14, "href": "/formations/ia-productivite", "type": "Atelier en direct", "image": "/images/fancyvision-events.webp", "title": "Atelier IA Productivité", "audience": "Particuliers", "location": "En ligne", "offsetDays": 23}, {"id": "vente-bordeaux", "host": "FancyVision Academy", "hour": 9, "href": "/formations/ia-vente", "type": "Formation FancyVision", "image": "/images/fancyvision-events.webp", "title": "IA Vente — prospecter avec méthode", "audience": "Particuliers", "location": "Bordeaux", "offsetDays": 31}, {"id": "ai-breakfast", "host": "FancyVision Conseil", "hour": 8, "href": "/rendez-vous", "type": "Rencontre privée", "image": "/images/fancyvision-events.webp", "title": "Petit-déjeuner des décideurs IA", "audience": "Entreprise", "location": "Paris", "offsetDays": 40}], "title": "Les prochaines sessions FancyVision", "eyebrow": "Agenda", "description": "Formations, ateliers et rencontres pour apprendre, pratiquer et échanger avec nos experts."}	7	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn1004cv7pwt89iytx5	cmsc9j0dq0019v71s9wd31wnn	process	Méthode	{"steps": ["Diagnostic des besoins", "Choix du service adapté", "Déploiement opérationnel", "Mesure et optimisation"], "title": "Du diagnostic à\\nl’amélioration continue", "eyebrow": "Notre méthode"}	8	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn1004dv7pw0situl9e	cmsc9j0dq0019v71s9wd31wnn	cta	CTA	{"title": "Vous avez un projet IA ?", "ctaHref": "/rendez-vous", "ctaLabel": "Planifier un appel", "description": "Planifiez un échange avec nos consultants et obtenez une démarche adaptée à votre organisation."}	9	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfn1004ev7pwxdv2n4w8	cmsc9j0dq0019v71s9wd31wnn	about	Le cabinet	{"image": "/images/fancyvision-ai-strategy.webp", "title": "Rendre l’IA accessible, utile et responsable", "ctaHref": "/a-propos", "eyebrow": "À propos", "ctaLabel": "Découvrir FancyVision", "description": "FancyVision réunit consultants, formateurs et experts produit pour relier la stratégie aux usages du quotidien."}	10	t	2026-08-03 03:08:27.565	2026-08-03 03:08:27.565
cmscngfod004ov7pwe61i4glj	cmsc9j0f8001qv71sfygm733z	legal	Contenu légal	{"body": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Éditeur", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "FancyVision présente ses activités de conseil et de formation en intelligence artificielle.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Données personnelles", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les données communiquées sont utilisées pour répondre aux demandes et gérer la relation commerciale.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Vos droits", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Vous pouvez demander l’accès, la rectification ou l’effacement de vos données à bonjour@fancyvision.ai.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Propriété intellectuelle", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Les marques, textes, visuels et éléments graphiques restent protégés par les droits de leurs titulaires.", "type": "text"}]}]}}	0	t	2026-08-03 03:08:27.614	2026-08-03 03:08:27.614
\.


--
-- Data for Name: Seo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Seo" (id, "pageId", "serviceId", "trainingId", "articleId", "caseStudyId", title, description, keywords, canonical, "ogImage", schema, "noIndex") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Service" (id, locale, "categoryId", title, slug, excerpt, content, icon, image, status, "order", featured, "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmsc9j099000dv71spred8evr	fr	cmsc9j08n0009v71s6fxklqew	Conduite du changement	conduite-du-changement	Gouvernance, ambassadeurs, veille et mesure des usages pour faire progresser l’adoption dans la durée.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Conduite du changement IA : installez une dynamique durable", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Gouvernance, ambassadeurs, veille et mesure des usages pour faire progresser l’adoption dans la durée.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Gouvernance IA", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Animation des ambassadeurs", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Veille technologique", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Mesure de l’adoption", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	route	/images/fancyvision-training.webp	PUBLISHED	1	t	2026-08-03 03:08:27.245	2026-08-02 20:38:32.973	2026-08-03 03:08:27.265
cmsc9j09j000hv71ss9pyvhq3	fr	cmsc9j08n0009v71s6fxklqew	Gestion des licences IA	gestion-licences	Choix, paramétrage et déploiement sécurisé des meilleurs outils d’IA générative pour vos équipes.	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nous vous aidons à choisir et administrer ChatGPT Enterprise, Microsoft Copilot, Claude ou Mistral.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "La sécurité, la conformité et le pilotage des coûts sont intégrés dès le départ.", "type": "text"}]}]}	key-round	\N	ARCHIVED	3	f	2026-08-02 20:38:32.982	2026-08-02 20:38:32.983	2026-08-03 03:08:27.306
cmsc9j09e000fv71sunil2vvj	fr	cmsc9j08n0009v71s6fxklqew	Développement sur-mesure	developpement-sur-mesure	Concevez des assistants et automatisations connectés à vos outils, données et contraintes de sécurité.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Agents IA sur mesure : automatisez vos workflows", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Concevez des assistants et automatisations connectés à vos outils, données et contraintes de sécurité.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Cadrage du besoin", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Prototype rapide", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Connexion aux outils", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Déploiement et suivi", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	sparkles	/images/fancyvision-data-systems.webp	PUBLISHED	2	t	2026-08-03 03:08:27.245	2026-08-02 20:38:32.978	2026-08-03 03:08:27.271
cmsc9j0k1002rv71sym4u940e	fr	cmsc9j0il002hv71sg8b3yjir	Stratégie & gouvernance Data	strategie-gouvernance	Alignez les données avec vos objectifs, définissez les responsabilités et installez un cadre de qualité, sécurité et conformité.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Construisez une stratégie Data claire et gouvernable", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Alignez les données avec vos objectifs, définissez les responsabilités et installez un cadre de qualité, sécurité et conformité.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Diagnostic de maturité", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Gouvernance et rôles", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Qualité des données", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Roadmap Data", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	\N	/images/fancyvision-data-systems.webp	PUBLISHED	4	t	2026-08-03 03:08:27.245	2026-08-02 20:38:33.362	2026-08-03 03:08:27.281
cmsc9j08z000bv71saskajrkk	fr	cmsc9j08n0009v71s6fxklqew	Audit IA	audit-ia	Cartographiez les opportunités, priorisez les quick wins et repartez avec une feuille de route opérationnelle.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Audit IA : identifiez les cas d’usage à fort impact", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cartographiez les opportunités, priorisez les quick wins et repartez avec une feuille de route opérationnelle.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Cadrage de la mission", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Entretiens métiers", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Priorisation des cas d’usage", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Roadmap de déploiement", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	scan-search	/images/fancyvision-ai-strategy.webp	PUBLISHED	0	t	2026-08-03 03:08:27.245	2026-08-02 20:38:32.963	2026-08-03 03:08:27.259
cmsc9j0ju002pv71ss7p86wu4	fr	cmsc9j08n0009v71s6fxklqew	Gestion de licences IA	gestion-des-licences-ia	Sélection, configuration, déploiement sécurisé et pilotage des solutions utilisées par vos équipes.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Gestion externalisée des licences IA", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Sélection, configuration, déploiement sécurisé et pilotage des solutions utilisées par vos équipes.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Choix des solutions", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Configuration", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Déploiement", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Suivi des usages", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	\N	/images/fancyvision-ai-strategy.webp	PUBLISHED	3	t	2026-08-03 03:08:27.245	2026-08-02 20:38:33.354	2026-08-03 03:08:27.276
cmsc9j0kl002xv71sg6yuhade	fr	cmsc9j0il002hv71sg8b3yjir	Data Science & IA	data-science-ia	Développez des modèles prédictifs et des solutions d’IA adaptés aux enjeux de prévision, segmentation et optimisation.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Passez de la donnée à la prédiction", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Développez des modèles prédictifs et des solutions d’IA adaptés aux enjeux de prévision, segmentation et optimisation.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Exploration des données", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Modèles prédictifs", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "MLOps & déploiement", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Mesure de performance", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	\N	/images/fancyvision-training.webp	PUBLISHED	7	t	2026-08-03 03:08:27.245	2026-08-02 20:38:33.381	2026-08-03 03:08:27.3
cmsc9j0ka002tv71sc6p7eja9	fr	cmsc9j0il002hv71sg8b3yjir	Data Engineering	data-engineering	Concevez des pipelines modernes, automatisez les flux et rendez les données accessibles aux équipes et aux produits.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Transformez vos données en fondations fiables", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Concevez des pipelines modernes, automatisez les flux et rendez les données accessibles aux équipes et aux produits.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Architecture Data", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Pipelines ETL / ELT", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Cloud & modernisation", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Monitoring des flux", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	\N	/images/fancyvision-ai-strategy.webp	PUBLISHED	5	t	2026-08-03 03:08:27.245	2026-08-02 20:38:33.37	2026-08-03 03:08:27.287
cmsc9j0kf002vv71sdbrh437f	fr	cmsc9j0il002hv71sg8b3yjir	Business Intelligence	business-intelligence	Créez des tableaux de bord lisibles, des modèles de données cohérents et un reporting réellement utilisé par les métiers.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Pilotez votre activité avec les bons indicateurs", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Créez des tableaux de bord lisibles, des modèles de données cohérents et un reporting réellement utilisé par les métiers.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Ce que comprend l’accompagnement", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Cadrage des KPI", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Modélisation analytique", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Dashboards interactifs", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "content": [{"text": "Adoption des outils BI", "type": "text"}]}]}]}, {"type": "paragraph", "content": [{"text": "Chaque intervention est adaptée à votre organisation, à vos outils et à vos contraintes de sécurité.", "type": "text"}]}]}	\N	/images/fancyvision-ai-strategy.webp	PUBLISHED	6	t	2026-08-03 03:08:27.245	2026-08-02 20:38:33.376	2026-08-03 03:08:27.292
\.


--
-- Data for Name: ServiceCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ServiceCategory" (id, name, slug, description, "order", "createdAt", "updatedAt") FROM stdin;
cmsc9j08n0009v71s6fxklqew	Conseil	conseil	De l’audit au déploiement, un accompagnement opérationnel pour vos projets d’intelligence artificielle.	0	2026-08-02 20:38:32.951	2026-08-03 03:08:27.248
cmsc9j0il002hv71sg8b3yjir	Data	data	Des fondations Data fiables et des produits qui transforment vos données en décisions.	1	2026-08-02 20:38:33.309	2026-08-03 03:08:27.254
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" ("sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Setting" (id, key, value, "group", "createdAt", "updatedAt") FROM stdin;
cmsc9j0gl0021v71s4iipp3n3	cookie	{"text": "Nous utilisons des cookies essentiels et, avec votre accord, des mesures d’audience.", "enabled": true}	legal	2026-08-02 20:38:33.237	2026-08-03 03:08:27.205
cmsc9j0g9001zv71sb0ebbags	company	{"name": "FancyVision", "email": "bonjour@fancyvision.ai", "phone": "07 56 28 77 92", "address": "128 rue La Boétie, 75008 Paris", "linkedin": "https://www.linkedin.com"}	general	2026-08-02 20:38:33.226	2026-08-03 03:08:27.69
cmsc9j0ge0020v71spykxlttd	site	{"logo": "FancyVision", "tagline": "Conseil, formation et intégration de l’intelligence artificielle.", "defaultOgImage": "/images/fancyvision-ai-strategy.webp"}	branding	2026-08-02 20:38:33.231	2026-08-03 03:08:27.694
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, name, slug) FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TeamMember" (id, name, "position", biography, picture, linkedin, social, "order", visible, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Testimonial" (id, name, company, "position", quote, avatar, rating, visible, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Training; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Training" (id, locale, "categoryId", title, slug, excerpt, content, objectives, audience, modules, "priceCents", duration, image, "pdfUrl", instructor, difficulty, status, featured, "order", "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmsc9j0al000pv71s8qwy38pn	fr	cmsc9j09y000jv71s2naht2x8	IA Productivité	ia-productivite	Maîtrisez ChatGPT, Claude et les meilleurs outils pour rédiger, synthétiser et analyser plus vite.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Formation IA Productivité", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Maîtrisez ChatGPT, Claude et les meilleurs outils pour rédiger, synthétiser et analyser plus vite.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.", "type": "text"}]}]}	{"Comprendre les modèles et leurs limites","Structurer de meilleurs prompts","Appliquer l’IA à des situations métier réelles","Adopter les bonnes pratiques de sécurité"}	{"Indépendants et particuliers"}	[{"title": "Diagnostic", "description": "Identifier les besoins et le niveau des participants."}, {"title": "Démonstrations métier", "description": "Découvrir les usages les plus utiles dans votre contexte."}, {"title": "Exercices pratiques", "description": "S’entraîner sur des cas concrets avec les outils d’IA."}, {"title": "Ressources & suivi", "description": "Repartir avec des supports et un plan de progression."}]	149000	Programme intensif	/images/fancyvision-training.webp	\N	\N	ALL_LEVELS	PUBLISHED	t	4	2026-08-03 03:08:27.245	2026-08-02 20:38:33.021	2026-08-03 03:08:27.352
cmsc9j0ln0035v71si05ccfyy	fr	cmsc9j09n000iv71shvxe31d8	Conférences IA	conferences-ia	Une intervention dynamique et adaptée à votre secteur pour comprendre les transformations en cours.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Conférences IA pour vos collaborateurs", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une intervention dynamique et adaptée à votre secteur pour comprendre les transformations en cours.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.", "type": "text"}]}]}	{"Comprendre les modèles et leurs limites","Structurer de meilleurs prompts","Appliquer l’IA à des situations métier réelles","Adopter les bonnes pratiques de sécurité"}	{"Grandes audiences"}	[{"title": "Diagnostic", "description": "Identifier les besoins et le niveau des participants."}, {"title": "Démonstrations métier", "description": "Découvrir les usages les plus utiles dans votre contexte."}, {"title": "Exercices pratiques", "description": "S’entraîner sur des cas concrets avec les outils d’IA."}, {"title": "Ressources & suivi", "description": "Repartir avec des supports et un plan de progression."}]	\N	1 à 2 heures	/images/fancyvision-training.webp	\N	\N	ALL_LEVELS	PUBLISHED	t	2	2026-08-03 03:08:27.245	2026-08-02 20:38:33.419	2026-08-03 03:08:27.339
cmsc9j0af000nv71suhee5q09	fr	cmsc9j09n000iv71shvxe31d8	IA Performer	ia-performer	Développez des workflows plus avancés et apprenez à orchestrer plusieurs modèles et outils.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "IA Performer : perfectionnement et nouveaux outils", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Développez des workflows plus avancés et apprenez à orchestrer plusieurs modèles et outils.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.", "type": "text"}]}]}	{"Comprendre les modèles et leurs limites","Structurer de meilleurs prompts","Appliquer l’IA à des situations métier réelles","Adopter les bonnes pratiques de sécurité"}	{"Utilisateurs confirmés"}	[{"title": "Diagnostic", "description": "Identifier les besoins et le niveau des participants."}, {"title": "Démonstrations métier", "description": "Découvrir les usages les plus utiles dans votre contexte."}, {"title": "Exercices pratiques", "description": "S’entraîner sur des cas concrets avec les outils d’IA."}, {"title": "Ressources & suivi", "description": "Repartir avec des supports et un plan de progression."}]	\N	1 à 2 jours	/images/fancyvision-data-systems.webp	\N	\N	ADVANCED	PUBLISHED	t	1	2026-08-03 03:08:27.245	2026-08-02 20:38:33.016	2026-08-03 03:08:27.333
cmsc9j0a8000lv71sf42u12hc	fr	cmsc9j09n000iv71shvxe31d8	IA Booster	ia-booster	Comprendre l’IA générative, structurer ses prompts et gagner du temps sur les tâches quotidiennes.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Formation IA Booster : maîtrisez ChatGPT", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Comprendre l’IA générative, structurer ses prompts et gagner du temps sur les tâches quotidiennes.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.", "type": "text"}]}]}	{"Comprendre les modèles et leurs limites","Structurer de meilleurs prompts","Appliquer l’IA à des situations métier réelles","Adopter les bonnes pratiques de sécurité"}	{"Tous collaborateurs"}	[{"title": "Diagnostic", "description": "Identifier les besoins et le niveau des participants."}, {"title": "Démonstrations métier", "description": "Découvrir les usages les plus utiles dans votre contexte."}, {"title": "Exercices pratiques", "description": "S’entraîner sur des cas concrets avec les outils d’IA."}, {"title": "Ressources & suivi", "description": "Repartir avec des supports et un plan de progression."}]	\N	1 journée	/images/fancyvision-training.webp	\N	\N	BEGINNER	PUBLISHED	t	0	2026-08-03 03:08:27.245	2026-08-02 20:38:33.008	2026-08-03 03:08:27.327
cmsc9j0lt0037v71sv4j5pa63	fr	cmsc9j09n000iv71shvxe31d8	Coaching dirigeant	coaching-ia-pour-dirigeant	Cinq sessions privées pour accélérer la prise de décision et construire votre feuille de route IA.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Coaching individuel en IA pour dirigeants", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Cinq sessions privées pour accélérer la prise de décision et construire votre feuille de route IA.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.", "type": "text"}]}]}	{"Comprendre les modèles et leurs limites","Structurer de meilleurs prompts","Appliquer l’IA à des situations métier réelles","Adopter les bonnes pratiques de sécurité"}	{"Dirigeants et COMEX"}	[{"title": "Diagnostic", "description": "Identifier les besoins et le niveau des participants."}, {"title": "Démonstrations métier", "description": "Découvrir les usages les plus utiles dans votre contexte."}, {"title": "Exercices pratiques", "description": "S’entraîner sur des cas concrets avec les outils d’IA."}, {"title": "Ressources & suivi", "description": "Repartir avec des supports et un plan de progression."}]	\N	5 sessions	/images/fancyvision-ai-strategy.webp	\N	\N	ALL_LEVELS	PUBLISHED	t	3	2026-08-03 03:08:27.245	2026-08-02 20:38:33.425	2026-08-03 03:08:27.345
cmsc9j0m8003bv71sxf11g9l9	fr	cmsc9j09y000jv71s2naht2x8	IA Vente	ia-vente	Ciblez vos prospects, personnalisez vos messages et accélérez le suivi commercial avec l’IA.	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Formation IA Vente", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ciblez vos prospects, personnalisez vos messages et accélérez le suivi commercial avec l’IA.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Une pédagogie centrée sur la pratique, des démonstrations métier et des exercices directement applicables.", "type": "text"}]}]}	{"Comprendre les modèles et leurs limites","Structurer de meilleurs prompts","Appliquer l’IA à des situations métier réelles","Adopter les bonnes pratiques de sécurité"}	{"Commerciaux et entrepreneurs"}	[{"title": "Diagnostic", "description": "Identifier les besoins et le niveau des participants."}, {"title": "Démonstrations métier", "description": "Découvrir les usages les plus utiles dans votre contexte."}, {"title": "Exercices pratiques", "description": "S’entraîner sur des cas concrets avec les outils d’IA."}, {"title": "Ressources & suivi", "description": "Repartir avec des supports et un plan de progression."}]	\N	Programme opérationnel	/images/fancyvision-data-systems.webp	\N	\N	ALL_LEVELS	PUBLISHED	t	5	2026-08-03 03:08:27.245	2026-08-02 20:38:33.441	2026-08-03 03:08:27.359
\.


--
-- Data for Name: TrainingCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TrainingCategory" (id, name, slug, description, "order") FROM stdin;
cmsc9j09n000iv71shvxe31d8	Formation en entreprise	entreprise	Des parcours par niveau et par métier, partout en France ou à distance.	0
cmsc9j09y000jv71s2naht2x8	Formation pour particuliers	particuliers	Des formations pratiques et des ateliers en ligne pour développer vos compétences.	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, "emailVerified", image, "passwordHash", status, "roleId", "createdAt", "updatedAt") FROM stdin;
cmsc9j08f0008v71s8fepzd0i	Admin FancyVision	admin@fancyvision.fr	\N	\N	$2b$12$7GlIaUzHIY0p6EmUDXENzuRHKSZLZ/P6pNHn3PfRS8YJxSi6j1wQW	ACTIVE	cmsc9izvh0000v71s6wizezx5	2026-08-02 20:38:32.944	2026-08-03 03:08:26.936
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
94dd7c64-fbf7-4d4b-9048-dd64b9a9b9f9	ef478965f74b3f55147d1ae56e6642ba2a0ed54e931be0d8aae623af5e06a38f	2026-08-02 20:38:30.387586+00	0001_init	\N	\N	2026-08-02 20:38:29.502336+00	1
5a1e6057-418c-4ac0-8245-484797b8a952	54f0a34b97f6421db874950e95f73036f6125fe26eb8bbc1d677dcc62ce50e37	2026-08-02 21:14:57.468124+00	0002_events	\N	\N	2026-08-02 21:14:57.279939+00	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (provider, "providerAccountId");


--
-- Name: AnalyticsEvent AnalyticsEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AnalyticsEvent"
    ADD CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY (id);


--
-- Name: Appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY (id);


--
-- Name: ArticleCategory ArticleCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleCategory"
    ADD CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY (id);


--
-- Name: ArticleRelation ArticleRelation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleRelation"
    ADD CONSTRAINT "ArticleRelation_pkey" PRIMARY KEY ("fromId", "toId");


--
-- Name: ArticleTag ArticleTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleTag"
    ADD CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("articleId", "tagId");


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: CaseStudy CaseStudy_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CaseStudy"
    ADD CONSTRAINT "CaseStudy_pkey" PRIMARY KEY (id);


--
-- Name: ContactRequest ContactRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactRequest"
    ADD CONSTRAINT "ContactRequest_pkey" PRIMARY KEY (id);


--
-- Name: EventRegistration EventRegistration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EventRegistration"
    ADD CONSTRAINT "EventRegistration_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Faq Faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: MenuItem MenuItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY (id);


--
-- Name: Menu Menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Menu"
    ADD CONSTRAINT "Menu_pkey" PRIMARY KEY (id);


--
-- Name: NewsletterSubscriber NewsletterSubscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NewsletterSubscriber"
    ADD CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY (id);


--
-- Name: Page Page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Redirect Redirect_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Redirect"
    ADD CONSTRAINT "Redirect_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Section Section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_pkey" PRIMARY KEY (id);


--
-- Name: Seo Seo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Seo"
    ADD CONSTRAINT "Seo_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCategory ServiceCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken");


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- Name: TrainingCategory TrainingCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingCategory"
    ADD CONSTRAINT "TrainingCategory_pkey" PRIMARY KEY (id);


--
-- Name: Training Training_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationToken VerificationToken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY (identifier, token);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AnalyticsEvent_name_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AnalyticsEvent_name_createdAt_idx" ON public."AnalyticsEvent" USING btree (name, "createdAt");


--
-- Name: Appointment_status_preferredDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Appointment_status_preferredDate_idx" ON public."Appointment" USING btree (status, "preferredDate");


--
-- Name: ArticleCategory_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON public."ArticleCategory" USING btree (slug);


--
-- Name: Article_locale_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Article_locale_slug_key" ON public."Article" USING btree (locale, slug);


--
-- Name: Article_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Article_status_publishedAt_idx" ON public."Article" USING btree (status, "publishedAt");


--
-- Name: AuditLog_entity_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_entity_createdAt_idx" ON public."AuditLog" USING btree (entity, "createdAt");


--
-- Name: CaseStudy_locale_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CaseStudy_locale_slug_key" ON public."CaseStudy" USING btree (locale, slug);


--
-- Name: CaseStudy_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "CaseStudy_status_publishedAt_idx" ON public."CaseStudy" USING btree (status, "publishedAt");


--
-- Name: ContactRequest_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactRequest_status_createdAt_idx" ON public."ContactRequest" USING btree (status, "createdAt");


--
-- Name: EventRegistration_eventId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EventRegistration_eventId_createdAt_idx" ON public."EventRegistration" USING btree ("eventId", "createdAt");


--
-- Name: EventRegistration_eventId_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EventRegistration_eventId_email_key" ON public."EventRegistration" USING btree ("eventId", email);


--
-- Name: Event_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Event_slug_key" ON public."Event" USING btree (slug);


--
-- Name: Event_status_startAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Event_status_startAt_idx" ON public."Event" USING btree (status, "startAt");


--
-- Name: Media_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Media_key_key" ON public."Media" USING btree (key);


--
-- Name: MenuItem_menuId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MenuItem_menuId_order_idx" ON public."MenuItem" USING btree ("menuId", "order");


--
-- Name: Menu_location_locale_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Menu_location_locale_key" ON public."Menu" USING btree (location, locale);


--
-- Name: NewsletterSubscriber_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON public."NewsletterSubscriber" USING btree (email);


--
-- Name: Page_locale_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Page_locale_slug_key" ON public."Page" USING btree (locale, slug);


--
-- Name: Page_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Page_status_publishedAt_idx" ON public."Page" USING btree (status, "publishedAt");


--
-- Name: Permission_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Permission_key_key" ON public."Permission" USING btree (key);


--
-- Name: Redirect_source_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Redirect_source_key" ON public."Redirect" USING btree (source);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Section_pageId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Section_pageId_order_idx" ON public."Section" USING btree ("pageId", "order");


--
-- Name: Seo_articleId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Seo_articleId_key" ON public."Seo" USING btree ("articleId");


--
-- Name: Seo_caseStudyId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Seo_caseStudyId_key" ON public."Seo" USING btree ("caseStudyId");


--
-- Name: Seo_pageId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Seo_pageId_key" ON public."Seo" USING btree ("pageId");


--
-- Name: Seo_serviceId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Seo_serviceId_key" ON public."Seo" USING btree ("serviceId");


--
-- Name: Seo_trainingId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Seo_trainingId_key" ON public."Seo" USING btree ("trainingId");


--
-- Name: ServiceCategory_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON public."ServiceCategory" USING btree (slug);


--
-- Name: Service_locale_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Service_locale_slug_key" ON public."Service" USING btree (locale, slug);


--
-- Name: Service_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Service_status_order_idx" ON public."Service" USING btree (status, "order");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Setting_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Setting_key_key" ON public."Setting" USING btree (key);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: TrainingCategory_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TrainingCategory_slug_key" ON public."TrainingCategory" USING btree (slug);


--
-- Name: Training_locale_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Training_locale_slug_key" ON public."Training" USING btree (locale, slug);


--
-- Name: Training_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Training_status_order_idx" ON public."Training" USING btree (status, "order");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Appointment Appointment_assignedConsultantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_assignedConsultantId_fkey" FOREIGN KEY ("assignedConsultantId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ArticleRelation ArticleRelation_fromId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleRelation"
    ADD CONSTRAINT "ArticleRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleRelation ArticleRelation_toId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleRelation"
    ADD CONSTRAINT "ArticleRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleTag ArticleTag_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleTag"
    ADD CONSTRAINT "ArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleTag ArticleTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleTag"
    ADD CONSTRAINT "ArticleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Article Article_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ArticleCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CaseStudy CaseStudy_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CaseStudy"
    ADD CONSTRAINT "CaseStudy_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EventRegistration EventRegistration_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EventRegistration"
    ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MenuItem MenuItem_menuId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES public."Menu"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MenuItem MenuItem_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."MenuItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Section Section_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Seo Seo_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Seo"
    ADD CONSTRAINT "Seo_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Seo Seo_caseStudyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Seo"
    ADD CONSTRAINT "Seo_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES public."CaseStudy"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Seo Seo_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Seo"
    ADD CONSTRAINT "Seo_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Seo Seo_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Seo"
    ADD CONSTRAINT "Seo_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Seo Seo_trainingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Seo"
    ADD CONSTRAINT "Seo_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES public."Training"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Service Service_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Training Training_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."TrainingCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict l4YFnzb2yhRupOQicohCQM4O75sghNuSFmFFe4I6yEQuZZpCMbLwdGdPfL9x2z9

