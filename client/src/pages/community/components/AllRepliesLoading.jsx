import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const AllRepliesLoading = () => {
  return (
    <div>	<div className="flex mt-5 justify-between">
    <Skeleton className="h-10 mt-5 w-22" />
    <Skeleton className="h-10 mt-5 w-22" />
</div>
<Skeleton className="h-1 mt-2 w-full" />
<Skeleton className="h-35 mt-4 w-full" />
<Skeleton className="h-1 mt-10 w-full" />
<Skeleton className="h-35 mt-4 w-full" />
<Skeleton className="h-1 mt-10 w-full" />
<Skeleton className="h-35 mt-4 w-full" /></div>
  )
}

export default AllRepliesLoading