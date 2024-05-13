async function streamToString(stream: any) {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let result = '';
  
    async function read() {
      const { done, value } = await reader.read();
  
      if (done) {
        return result;
      }
  
      result += textDecoder.decode(value, { stream: true });
      return read();
    }
  
    return read();
  }


export async function get_data(hours: number) {
    const url = "database?hours_back=" + hours

    const response = await fetch(url, {method: "GET"})
    const result = await streamToString(response.body)
    
    return JSON.parse(result)
}