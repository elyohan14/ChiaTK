import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Card from 'App/Models/Card'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

export default class CardsController {
  public async index({}: HttpContextContract) {
    const cards = await Card.all()
    return cards
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const image = request.file('file')

      if (image) {
        await image.move(Application.tmpPath('uploads'))
      }
      const body = request.body()
      delete body.file

      await Card.create(body)
    } catch (error) {
      console.log({ error })
      response.internalServerError(error)
    }
    return true
  }

  public async show({ request }: HttpContextContract) {

    const { id } = request.params()
    const card = await Card.find(id)
    const url = await Drive.getUrl(card.filename)
    card.filenamep = url ? 'http://127.0.0.1:3333' + url : null
    console.log({ card })
    return card
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request }: HttpContextContract) {
    const { title, description, stock, filename } = request.body()
    const { id } = request.params()
    const image = request.file('file')

    if (image) {
      await image.move(Application.tmpPath('uploads'))
    }

    await Card.query().where('id', id).update({ title, description, stock, filename})
    return true
  }

  public async destroy ({ request }: HttpContextContract) {
    const { id } = request.params()
    const card = await Card.findOrFail(id)
    await card.delete()
  }
}
