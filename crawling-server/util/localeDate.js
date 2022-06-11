function localDate() {
  const now = new Date()
  now.setHours(now.getHours() + 9)
  
  return now
}

export default localDate