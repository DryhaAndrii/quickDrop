import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class InviteService {
  private invites = new Map<string, { roomName: string; password: string }>()

  createInvite(roomName: string, password: string): string {
    try {
      const inviteId = uuidv4()
      this.invites.set(inviteId, { roomName, password })

      setTimeout(() => this.invites.delete(inviteId), 10 * 60 * 1000)

      return inviteId
    } catch (error) {
      console.error('Error generating invite id:', error)
      throw error
    }
  }
  exchangeInviteIdToToken(inviteId: string): { roomName: string; password: string } {
    try {
      const invite = this.invites.get(inviteId)
      if (!invite) throw new Error('Invite not found')
      return invite
    } catch (error) {
      console.error('Error exchanging invite id:', error)
      throw error
    }
  }
}
