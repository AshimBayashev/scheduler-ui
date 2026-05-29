import { apiFetch } from './client'

export interface FamilyMember {
  userId: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: 'owner' | 'member'
}

export interface FamilyInvitation {
  id: string
  email: string
  status: string
  createdAt: string
}

export interface IncomingFamilyInvitation {
  id: string
  familyId: string
  familyName: string
  inviterName: string | null
  createdAt: string
}

export interface FamilyOverview {
  inFamily: boolean
  family: { id: string; name: string } | null
  role: 'owner' | 'member' | null
  members: FamilyMember[]
  sentInvitations: FamilyInvitation[]
  incomingInvitations: IncomingFamilyInvitation[]
}

export function fetchFamilyOverview() {
  return apiFetch<FamilyOverview>('/family')
}

export function createFamily(name?: string) {
  return apiFetch<FamilyOverview>('/family', {
    method: 'POST',
    body: JSON.stringify(name ? { name } : {}),
  })
}

export function updateFamilyName(name: string) {
  return apiFetch<FamilyOverview>('/family', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}

export function deleteFamily() {
  return apiFetch<{ success: boolean }>('/family', { method: 'DELETE' })
}

export function inviteToFamily(email: string) {
  return apiFetch<FamilyOverview>('/family/invitations', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function cancelFamilyInvitation(invitationId: string) {
  return apiFetch<FamilyOverview>(`/family/invitations/${invitationId}`, {
    method: 'DELETE',
  })
}

export function acceptFamilyInvitation(invitationId: string) {
  return apiFetch<FamilyOverview>(`/family/invitations/${invitationId}/accept`, {
    method: 'POST',
  })
}

export function declineFamilyInvitation(invitationId: string) {
  return apiFetch<FamilyOverview>(`/family/invitations/${invitationId}/decline`, {
    method: 'POST',
  })
}

export function removeFamilyMember(userId: string) {
  return apiFetch<FamilyOverview>(`/family/members/${userId}`, {
    method: 'DELETE',
  })
}

export function getMemberDisplayName(member: Pick<FamilyMember, 'name' | 'email'>) {
  return member.name?.trim() || member.email.split('@')[0] || member.email
}
