// Calorie Calculator based on MET (Metabolic Equivalent of Task) values
// MET values represent the energy cost of physical activities

const exerciseMETValues = {
  // Strength Training
  'Barbell Squat': 6.0,
  'Bench Press': 6.0,
  'Deadlift': 6.0,
  'Pull-ups': 8.0,
  'Overhead Press': 6.0,
  'Bicep Curls': 3.0,
  'Tricep Dips': 8.0,
  'Lunges': 4.0,
  'Lat Pulldown': 5.0,
  'Leg Press': 6.0,
  'Dumbbell Fly': 5.0,
  'Face Pulls': 4.0,
  
  // Core
  'Plank': 4.0,
  'Russian Twists': 5.0,
  'Leg Raises': 5.0,
  
  // Cardio
  'Burpees': 8.0,
  'Mountain Climbers': 8.0,
  'Box Jumps': 10.0,
  
  // Default values for categories
  'strength': 6.0,
  'cardio': 8.0,
  'core': 5.0
}

/**
 * Calculate calories burned during exercise
 * Formula: Calories = MET × weight(kg) × duration(hours)
 */
export const calculateCaloriesBurned = (exerciseName, weightKg = 70, durationMinutes = 30) => {
  const met = exerciseMETValues[exerciseName] || exerciseMETValues['strength']
  const durationHours = durationMinutes / 60
  const calories = met * weightKg * durationHours
  return Math.round(calories)
}

/**
 * Calculate calories burned for a workout session
 */
export const calculateWorkoutCalories = (exercises, weightKg = 70) => {
  if (!exercises || exercises.length === 0) return 0
  
  const totalCalories = exercises.reduce((sum, exercise) => {
    const duration = exercise.duration || 10
    return sum + calculateCaloriesBurned(exercise.name, weightKg, duration)
  }, 0)
  
  return Math.round(totalCalories)
}

/**
 * Calculate recommended water intake after exercise
 * Approximately 1 liter per 500 calories burned
 */
export const calculateWaterIntake = (caloriesBurned) => {
  const baseWater = (caloriesBurned / 500) * 1000
  return Math.round(baseWater)
}

/**
 * Calculate daily water needs based on weight and activity level
 * Base formula: 30-40ml per kg of body weight
 */
export const calculateDailyWaterNeeds = (weightKg = 70, activityLevel = 'moderate') => {
  const baseRate = {
    sedentary: 30,
    moderate: 35,
    active: 40,
    very_active: 45
  }
  
  const rate = baseRate[activityLevel] || baseRate.moderate
  return Math.round(weightKg * rate)
}

/**
 * Format water amount for display
 */
export const formatWaterAmount = (milliliters) => {
  if (milliliters >= 1000) {
    return `${(milliliters / 1000).toFixed(1)}L`
  }
  return `${milliliters}ml`
}

export default {
  calculateCaloriesBurned,
  calculateWorkoutCalories,
  calculateWaterIntake,
  calculateDailyWaterNeeds,
  formatWaterAmount
}
