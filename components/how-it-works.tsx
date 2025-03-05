import { CheckCircle2 } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Campaign",
      description: "Share your medical story, upload documentation, and set your funding goal.",
      icon: "1",
    },
    {
      title: "Verification Process",
      description: "Our team reviews your medical documentation to ensure authenticity.",
      icon: "2",
    },
    {
      title: "Campaign Goes Live",
      description: "Once verified, your campaign is published for donors to discover and support.",
      icon: "3",
    },
    {
      title: "Receive Donations",
      description: "Donors contribute to your campaign and receive updates on your progress.",
      icon: "4",
    },
    {
      title: "Funds Released",
      description: "Funds are released according to your treatment timeline and needs.",
      icon: "5",
    },
    {
      title: "Share Your Impact",
      description: "Update donors on your progress and treatment outcomes.",
      icon: "6",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our simple 6-step process ensures transparency and trust for both patients and donors.
            </p>
          </div>
        </div>

        <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-start space-y-3 bg-white p-6 rounded-lg shadow-sm dark:bg-gray-950"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-950">
          <h3 className="text-xl font-bold mb-4">Our Verification Process</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Document Review</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  We carefully review all medical documentation to verify the authenticity of each campaign.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Healthcare Provider Confirmation</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  When possible, we confirm details with healthcare providers to ensure accuracy.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Transparent Fund Usage</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  We track how funds are used and require documentation of medical expenses.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Regular Updates</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Campaign creators must provide regular updates on their treatment progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

