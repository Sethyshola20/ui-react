import { BSParams } from '@/types/options'
import { priceOptionUseCase } from '@/use-cases/options'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'



export function useOptionPricing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:BSParams) => priceOptionUseCase({ data }),
    onSuccess: (data) => {
        queryClient.setQueryData(['option_price', data], data)
    }
  })
}

