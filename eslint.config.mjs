import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'data/**',
      'scripts/**',
      'next-env.d.ts',
    ],
  },
  {
    // Новые правила React Compiler (Next 16) очень строгие и срабатывают на
    // легитимных паттернах: синхронизация внешнего состояния в useEffect
    // (media query, гео-запрос, загрузка аккаунта мессенджера). Это не баги —
    // оставляем как предупреждения, чтобы не блокировать CI, но видеть сигнал.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  {
    // Сгенерированные компоненты shadcn/ui — стороннний код, не правим его
    // под строгие правила React Compiler.
    files: ['components/ui/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    },
  },
]

export default eslintConfig
