const API_BASE_URL = 'http://localhost:5000/api/v1'

export const contactAPI = {
  submitContact: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  },
}

export default contactAPI