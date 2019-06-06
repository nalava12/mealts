export namespace Utils {
  export function before(string: string, delimiter: string): string {
    let index = string.indexOf(delimiter)
    return string.substring(0, index)
  }
  export function after(string: string, delimiter: string): string {
    let index = string.indexOf(delimiter)
    return string.substring(index + delimiter.length)
  }
}