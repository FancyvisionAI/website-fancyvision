# Diagramme de données FancyVision

```mermaid
erDiagram
  User }o--|| Role : has
  Role ||--o{ RolePermission : grants
  Permission ||--o{ RolePermission : includes
  User ||--o{ Session : owns
  User ||--o{ Account : owns
  User ||--o{ AuditLog : performs
  User ||--o{ Article : authors
  User ||--o{ Appointment : assigned

  Page ||--o{ Section : contains
  Page ||--o| Seo : optimizes

  ServiceCategory ||--o{ Service : groups
  Service ||--o| Seo : optimizes
  Service ||--o{ CaseStudy : supports

  TrainingCategory ||--o{ Training : groups
  Training ||--o| Seo : optimizes

  ArticleCategory ||--o{ Article : groups
  Article ||--o{ ArticleTag : tagged
  Tag ||--o{ ArticleTag : labels
  Article ||--o{ ArticleRelation : relates
  Article ||--o| Seo : optimizes

  CaseStudy ||--o| Seo : optimizes

  Menu ||--o{ MenuItem : contains
  MenuItem ||--o{ MenuItem : nests

  User {
    string id PK
    string email UK
    string passwordHash
    enum status
  }
  Page {
    string id PK
    string locale
    string slug
    enum status
  }
  Section {
    string id PK
    string type
    json data
    int order
    boolean visible
  }
  Service {
    string id PK
    string slug
    json content
    enum status
  }
  Training {
    string id PK
    string slug
    json content
    json modules
    enum status
  }
  Article {
    string id PK
    string slug
    json content
    enum status
    datetime scheduledFor
  }
  ContactRequest {
    string id PK
    string email
    enum status
  }
  Appointment {
    string id PK
    datetime preferredDate
    enum status
  }
  NewsletterSubscriber {
    string id PK
    string email UK
    datetime unsubscribedAt
  }
  Setting {
    string id PK
    string key UK
    json value
  }
  Media {
    string id PK
    string url
    string alt
    string folder
  }
  AuditLog {
    string id PK
    string action
    string entity
    json before
    json after
  }
```

Les tables autonomes `Faq`, `Testimonial`, `TeamMember`, `Media`, `NewsletterSubscriber`, `ContactRequest`, `Setting`, `Redirect` et `AnalyticsEvent` sont volontairement indépendantes afin de simplifier leur CRUD et leur indexation.
