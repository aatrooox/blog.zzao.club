export interface Visitor {
  name?: string
  email?: string
  website?: string
  allowEmailNotify?: boolean
}

export interface CommentData {
  content: string
  tags?: string[]
  visitor?: Visitor
}

export default {}
