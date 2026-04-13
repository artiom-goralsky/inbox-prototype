export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
}

export const templates: Template[] = [
  {
    id: 'homepage',
    name: 'Homepage',
    description: 'Professional homepage with hero section and community focus',
    category: 'Business',
    preview: '/templates/homepage.jpg',
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales landing page with problem/solution structure',
    category: 'Business',
    preview: '/templates/sales.jpg',
  },
  {
    id: 'about',
    name: 'About Us',
    description: 'About page with team stats and company story',
    category: 'Business',
    preview: '/templates/about.jpg',
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing page with multiple tiers and features',
    category: 'Business',
    preview: '/templates/pricing.jpg',
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer testimonials and success stories',
    category: 'Business',
    preview: '/templates/testimonials.jpg',
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Contact page with form and company information',
    category: 'Business',
    preview: '/templates/contact.jpg',
  },
  {
    id: 'blog-listing',
    name: 'Blog Listing',
    description: 'Blog index page with article previews',
    category: 'Content',
    preview: '/templates/blog-listing.jpg',
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Single blog post layout with content',
    category: 'Content',
    preview: '/templates/blog.jpg',
  },
];
