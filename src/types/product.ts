export interface NutriScoreComponent {
  id: string
  value: number | null
  unit: string
  points: number
}

export interface NutriScore {
  grade: string
  score: number
  components: {
    positive: NutriScoreComponent[]
    negative: NutriScoreComponent[]
  }
}

export interface Product {
  name: string
  ingredients: string[]
  image: string
  nutriscore?: NutriScore
}
