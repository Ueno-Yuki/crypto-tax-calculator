import { ref, computed, onMounted, onUnmounted } from 'vue'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export const useDeviceDetection = () => {
  const screenWidth = ref(0)
  const screenHeight = ref(0)
  
  // Vuetifyのブレークポイントに合わせた閾値
  const BREAKPOINTS = {
    xs: 600,    // 0-599px
    sm: 960,    // 600-959px  
    md: 1264,   // 960-1263px
    lg: 1904,   // 1264-1903px
    xl: 1904    // 1904px+
  } as const

  // 画面サイズの更新
  const updateScreenSize = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }

  // デバイスタイプの判定
  const deviceType = computed<DeviceType>(() => {
    const width = screenWidth.value
    
    // モバイル（スマートフォン）
    if (width < BREAKPOINTS.sm) {
      return 'mobile'
    }
    
    // タブレット
    if (width < BREAKPOINTS.md) {
      return 'tablet'
    }
    
    // デスクトップ
    return 'desktop'
  })

  // 具体的なデバイス判定
  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')
  
  // タブレットとモバイルをまとめてタッチデバイスとして判定
  const isTouchDevice = computed(() => isMobile.value || isTablet.value)

  // ユーザーエージェントベースの判定（補助的な情報）
  const userAgent = computed(() => {
    if (typeof window === 'undefined') return {}
    
    const ua = window.navigator.userAgent.toLowerCase()
    
    return {
      isIOS: /iphone|ipad|ipod/.test(ua),
      isAndroid: /android/.test(ua),
      isSafari: /safari/.test(ua) && !/chrome/.test(ua),
      isChrome: /chrome/.test(ua),
      isFirefox: /firefox/.test(ua),
      isEdge: /edge/.test(ua)
    }
  })

  // 画面の向きの判定
  const orientation = computed(() => {
    if (screenWidth.value > screenHeight.value) {
      return 'landscape'
    }
    return 'portrait'
  })

  // ハイDPI（Retina）ディスプレイの判定
  const isHighDPI = computed(() => {
    if (typeof window === 'undefined') return false
    return window.devicePixelRatio > 1
  })

  // Vuetifyのブレークポイントに基づく判定
  const breakpoint = computed(() => {
    const width = screenWidth.value
    
    if (width < BREAKPOINTS.xs) return 'xs'
    if (width < BREAKPOINTS.sm) return 'sm' 
    if (width < BREAKPOINTS.md) return 'md'
    if (width < BREAKPOINTS.lg) return 'lg'
    return 'xl'
  })

  // タッチ機能の検出
  const hasTouchSupport = computed(() => {
    if (typeof window === 'undefined') return false
    
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    )
  })

  // ライフサイクル管理
  onMounted(() => {
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    window.addEventListener('orientationchange', updateScreenSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize)
    window.removeEventListener('orientationchange', updateScreenSize)
  })

  return {
    // 基本情報
    screenWidth: computed(() => screenWidth.value),
    screenHeight: computed(() => screenHeight.value),
    
    // デバイス判定
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    
    // ブレークポイント
    breakpoint,
    
    // 詳細情報
    orientation,
    isHighDPI,
    hasTouchSupport,
    userAgent,
    
    // ユーティリティ
    updateScreenSize
  }
}