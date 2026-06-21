import { getReferenceValues, getModelConfig } from '@/app/actions/master-data-actions'
import { getUsers } from '@/app/actions/user-actions'
import { MasterDataClient } from './master-data-client'

export const dynamic = 'force-dynamic'

export default async function MasterDataPage() {
  const { data: users = [] } = await getUsers()
  const { data: references = [] } = await getReferenceValues()
  const { data: modelConfigs = [] } = await getModelConfig()

  return (
    <MasterDataClient
      users={users || []}
      references={references || []}
      modelConfigs={modelConfigs || []}
    />
  )
}
