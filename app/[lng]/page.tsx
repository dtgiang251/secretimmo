// app/[lng]/page.tsx
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { generateStaticParams } from '../../generateParams'

// Thêm kiểu dữ liệu chính xác
type PageProps = {
  params: {
    lng: string;
  };
};

export { generateStaticParams }

export default async function Page({ params }: PageProps) {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} params={params} />
}
