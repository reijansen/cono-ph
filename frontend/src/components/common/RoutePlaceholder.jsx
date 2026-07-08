import PageHeader from '@/components/ui/PageHeader'

export default function RoutePlaceholder({ title }) {
  return (
    <PageHeader
      title={title}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: title },
      ]}
    />
  )
}
