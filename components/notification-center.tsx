'use client'

import { useState } from 'react'
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useNotifications, type Notification } from '@/hooks/use-notifications'

const notificationTypeStyles: Record<Notification['type'], { bg: string; text: string; icon: string }> = {
  info: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'bg-blue-500' },
  success: { bg: 'bg-green-100', text: 'text-green-700', icon: 'bg-green-500' },
  warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'bg-yellow-500' },
  error: { bg: 'bg-red-100', text: 'text-red-700', icon: 'bg-red-500' },
  lead: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'bg-purple-500' },
  campaign: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'bg-indigo-500' },
  system: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'bg-gray-500' },
}

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const styles = notificationTypeStyles[notification.type]
  
  return (
    <div
      className={cn(
        'p-3 border-b last:border-b-0 transition-colors hover:bg-muted/50',
        !notification.read && 'bg-primary/5'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0', styles.icon)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn('font-medium text-sm', !notification.read && 'font-semibold')}>
                {notification.title}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {notification.message}
              </p>
            </div>
            <Badge variant="outline" className={cn('text-xs shrink-0', styles.bg, styles.text)}>
              {notification.type}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            <div className="flex items-center gap-1">
              {notification.link && (
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <Link href={notification.link}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              )}
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => onDelete(notification.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll,
    requestNotificationPermission,
  } = useNotifications()

  // Request permission when opening
  const handleOpen = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      requestNotificationPermission()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="gap-1">
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-destructive hover:text-destructive gap-2"
                onClick={clearAll}
              >
                <Trash2 className="h-4 w-4" />
                Clear all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
