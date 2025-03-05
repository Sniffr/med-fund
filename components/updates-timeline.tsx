export default function UpdatesTimeline({
  updates,
}: { updates: Array<{ date: string; title: string; content: string }> }) {
  return (
    <div className="space-y-8">
      {updates.map((update, index) => (
        <div key={index} className="relative pl-8 pb-8">
          {/* Timeline connector */}
          {index < updates.length - 1 && (
            <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
          )}

          {/* Timeline dot */}
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">{update.date}</div>
            <h3 className="font-semibold">{update.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{update.content}</p>
          </div>
        </div>
      ))}

      <div className="text-center pt-4">
        <button className="text-primary hover:underline">View All Updates</button>
      </div>
    </div>
  )
}

