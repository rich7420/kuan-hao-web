import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getSortedPostsData(): Post[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // excerpt: use frontmatter excerpt, else description, else first ~160 chars of content (no markdown)
    const rawExcerpt = data.excerpt ?? data.description ?? '';
    const excerpt = rawExcerpt
      ? String(rawExcerpt).trim()
      : content
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*?(.*?)\*\*?/g, '$1')
          .replace(/\n+/g, ' ')
          .trim()
          .slice(0, 160) + (content.trim().length > 160 ? '…' : '');

    return {
      slug,
      content,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: excerpt || '',
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
