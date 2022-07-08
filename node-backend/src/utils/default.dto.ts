export class MessageDto {
  public message: string
  
  constructor(msg: string) {
    this.message = msg
  }
}

export class ValueDto {
  public value: any

  constructor(value: any) {
    this.value = value
  }
}