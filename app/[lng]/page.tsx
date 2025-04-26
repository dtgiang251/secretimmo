import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { generateStaticParams } from '../../generateParams'
import ClientPage from './ClientPage'

export { generateStaticParams } from '../../generateParams'

export default function Page({ params }: { params: { lng: string } }) {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} params={params} />
}
