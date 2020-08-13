import axios from 'axios'
import * as htmlParser from 'node-html-parser' 
import path from 'path'
import fs from 'fs'

export class Page {
    public url: string
    public archUrl: any

    constructor(url: string) {
        this.url = url
        let temp = url.split('.')
        this.archUrl = temp[0] + '.' + temp[1]
        this.archUrl = this.archUrl.replace('res', 'src')
    }

    public async loadPage() {
        const res = await axios({
            method: 'GET',
            url: this.url
        })
        return res.data
    }

    public parsePage(loadedPage: any) {
        const parseResult = htmlParser.parse(loadedPage)
        const elements = parseResult.querySelectorAll('.post__image-link')
        return elements
    }

    public async getHrefAttributes() {
        const loadedPage = await this.loadPage()
        const mediaElements = this.parsePage(loadedPage)

        const hrefAttrArr: string[] = []
        mediaElements.forEach(element => {
            hrefAttrArr.push(element.rawAttributes && element.rawAttributes.href)
        })

        return hrefAttrArr
    }

    public prepareDownloadObject(hrefAttr: string[]): { url: string, extension: string }[] {
        const res: { url: string, extension: string }[] = []
        if(hrefAttr) {
            hrefAttr.forEach(element => {
                const fileExtension = element.split('.')[1]
                const fileName = element.split('.')[0].split('/')
                res.push({ url: fileName[fileName.length - 1], extension: fileExtension })
            })
        }
        return res
    }

    public async getAndMapDownloadObjects() {
        const res = await this.getHrefAttributes()
        return this.prepareDownloadObject(res)
    }

    public async downloadAll() {
        const downloadObjects = await this.getAndMapDownloadObjects()
        let d = 0
        if(downloadObjects.length) {
            console.log(downloadObjects.length)
            for(let i = 0; i < downloadObjects.length; i++) {
                const pathToFile = path.resolve(__dirname, '../../files', '2ch' + Date.now() + i + '.' + downloadObjects[i].extension)
                const writer = fs.createWriteStream(pathToFile)

                try{
                    const response = await axios ({
                        url: this.archUrl + '/' + downloadObjects[i].url + '.' +downloadObjects[i].extension,
                        method: 'GET',
                        responseType: 'stream'
                    })

                    await response.data.pipe(writer)

                } catch (err) {
                    console.log(err)
                } finally {
                    d++
                    console.log(i)
                }
                
            }
        }
    }

}