import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient.js'

const likeCount = ref(0)
const isLoading = ref(true)
const hasLikedLocal = ref(false)

let channel = null

export function useLikeSync() {
  async function fetchCount() {
    isLoading.value = true
    const { data, error } = await supabase
      .from('counters')
      .select('count')
      .eq('id', 'likes')
      .single()

    if (!error && data) {
      likeCount.value = data.count
    }
    isLoading.value = false
  }

  async function addLike() {
    hasLikedLocal.value = true
    // Optimistic update — increment immediately
    likeCount.value += 1

    const { error } = await supabase.rpc('increment_counter', {
      counter_id: 'likes',
    })

    if (error) {
      // Rollback on failure
      likeCount.value -= 1
      console.error('点赞同步失败:', error)
    }
  }

  function subscribeRealtime() {
    channel = supabase
      .channel('counters-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'counters', filter: 'id=eq.likes' },
        (payload) => {
          likeCount.value = payload.new.count
        },
      )
      .subscribe()
  }

  onMounted(() => {
    fetchCount()
    subscribeRealtime()
  })

  onUnmounted(() => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  })

  return { likeCount, isLoading, addLike, hasLikedLocal }
}
