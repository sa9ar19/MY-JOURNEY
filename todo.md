# Personal Journey Website — TODO

## Database Schema
- [x] Add `destinations` table (id, name, description, cover_image_url, created_at)
- [x] Add `gallery_photos` table (id, destination_id, title, description, image_url, order, created_at)
- [x] Add `blog_posts` table (id, title, content, excerpt, featured_image_url, published_at, created_at)
- [x] Add `social_links` table (id, platform, url, icon, order)
- [x] Generate and apply database migrations

## Backend API
- [x] Add database helpers for destinations, gallery_photos, blog_posts, social_links
- [x] Create tRPC procedures for:
  - [x] destinations.list (public)
  - [x] destinations.getById (public)
  - [x] gallery.getByDestination (public)
  - [x] blog.list (public)
  - [x] blog.getById (public)
  - [x] admin.destinations.create (admin-only)
  - [x] admin.destinations.update (admin-only)
  - [x] admin.destinations.delete (admin-only)
  - [x] admin.photos.create (admin-only)
  - [x] admin.photos.delete (admin-only)
  - [x] admin.blog.create (admin-only)
  - [x] admin.blog.update (admin-only)
  - [x] admin.blog.delete (admin-only)
  - [x] admin.social.update (admin-only)
  - [x] social.list (public)
- [x] Enforce admin-only authorization with adminProcedure middleware

## Frontend Pages & Components
- [x] Set up minimalistic color palette and global styles
- [x] Create Navbar with navigation links and mobile menu
- [x] Create Home/Landing page with hero section
- [x] Create Gallery page (destinations list)
- [x] Create Gallery Detail page (photos by destination)
- [x] Create Blog List page
- [x] Create Blog Detail page
- [x] Create About page (static)
- [x] Create Admin Dashboard (protected, admin-only)
  - [x] Destinations management with form controls
  - [x] Blog management with form controls
  - [x] Social links management instructions
- [x] Create Footer with social links

## Features
- [x] Responsive design for all pages
- [x] Admin authentication and authorization checks
- [x] Error states and loading states on all data-fetching pages
- [x] Form-based CRUD operations in admin dashboard
- [x] Toast notifications for user feedback
- [x] Minimalistic neutral color palette with gradients
- [x] Elegant typography (Crimson Text + Inter)

## Quality
- [x] Write vitest tests for backend procedures (admin.test.ts)
- [x] Test admin authorization enforcement
- [x] Test public procedure access
- [x] All tests passing (10/10)
- [x] No TypeScript errors
- [x] No build errors
