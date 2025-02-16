export class NotificationService {
    static async sendStreakNotification(userId: string, type: 'milestone' | 'reminder' | 'broken', data: any) {
        const notifications = {
            milestone: `🎉 Congratulations! You've earned the ${data.badge} badge!`,
            reminder: '⚠️ Don't break your streak! Log a workout today to keep it going!',
      broken: '😢 Oh no! Your streak was broken. Start a new one today!'
    }

        // Send browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification(notifications[type])
        }

        // Store notification in database for in-app display
        await this.storeNotification(userId, {
            type,
            message: notifications[type],
            data,
            read: false,
            createdAt: new Date()
        })
    }

    static async checkStreakRisk() {
        // Run daily to check users at risk of breaking streaks
        const usersAtRisk = await this.getUsersWithStreakRisk()

        for (const user of usersAtRisk) {
            await this.sendStreakNotification(user.id, 'reminder', {
                currentStreak: user.currentStreak
            })
        }
    }
} 