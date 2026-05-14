import { PublicLayout } from '../../components/layout/PublicLayout'
import { ReviewsPageClient } from '../../components/reviews/ReviewsPageClient'
import { getReviews } from '../../lib/api'

export default async function ReviewsPage({ searchParams }: { searchParams: { rt?: string } }) {
  const reviews = await getReviews()

  return (
    <PublicLayout>
      <ReviewsPageClient initialReviews={reviews} reviewToken={searchParams.rt} />
    </PublicLayout>
  )
}
