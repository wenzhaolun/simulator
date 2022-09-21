export class TextBox {
    public textArray: Array<string> = []

    public push (text: string | null) {
        console.log('text from push of textBox ==>', text)
        if (text) {
            this.textArray.splice(0 , 0, text)
        } else {
            console.log('text is null')
        }
    }
    public getTextBox () {
        return this.textArray
    }
}