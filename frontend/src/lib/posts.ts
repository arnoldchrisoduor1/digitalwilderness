export type PostSection = {
  heading?: string;
  paragraphs: string[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "extended-kalman-filters",
    title: "Extended Kalman Filters",
    excerpt:
      "Why the standard Kalman filter breaks on nonlinear systems, and how the EKF fixes it well enough to fly.",
    date: "2026-08-10",
    sections: [
      {
        heading: "The problem a Kalman filter solves",
        paragraphs: [
          "A Kalman filter estimates the state of a system — position, velocity, orientation, whatever you're tracking — from a stream of noisy measurements. It runs a predict/update loop: predict where the state should be based on a model of how the system moves, then correct that prediction against a new measurement, weighting each by how much you trust it.",
          "The standard Kalman filter assumes both the system's motion and the measurement process are linear, and that the noise in each is Gaussian. Under those assumptions, the filter is provably optimal — it's the best linear estimator you can build.",
        ],
      },
      {
        heading: "Where linearity breaks down",
        paragraphs: [
          "Most physical systems aren't linear. Orientation wraps around in ways that don't add cleanly. A range-and-bearing sensor measures distance and angle to a target, not the target's x/y coordinates directly. Once the motion model or the measurement model is nonlinear, the standard filter's assumptions no longer hold, and its estimates stop being reliable.",
        ],
      },
      {
        heading: "What the EKF does differently",
        paragraphs: [
          "The Extended Kalman Filter handles this by linearizing the nonlinear functions at each step, around the current estimate, using a first-order Taylor expansion — in practice, computing a Jacobian matrix of partial derivatives and using that in place of the fixed linear model the standard filter expects. The predict and update equations otherwise stay the same shape.",
          "It's an approximation, not an exact solution. The linearization is only accurate near the current estimate, so if the estimate is badly wrong or the system is highly nonlinear over the step size, the EKF can diverge. In practice, for systems that are smooth and don't change too fast relative to the update rate, it works well — which is most of the systems we deal with.",
        ],
      },
      {
        heading: "Where it shows up",
        paragraphs: [
          "The EKF is a workhorse in sensor fusion and navigation: combining IMU, GPS, and other sensor streams into a single estimate of position, velocity, and attitude. It's a standard building block in avionics and robotics state estimation, largely because it's cheap enough to run in real time on constrained hardware and well-understood enough to trust in the field.",
          "When the nonlinearity is severe enough that the EKF's linear approximation isn't good enough, the usual next step is the Unscented Kalman Filter, which propagates a set of sample points through the true nonlinear functions instead of linearizing them. That's a different trade-off — more compute for a better approximation — and worth its own post.",
        ],
      },
    ],
  },
  {
    slug: "unet-cnn-dense-prediction",
    title: "U-Net: A CNN Architecture for Dense Prediction",
    excerpt:
      "An encoder-decoder with skip connections, built for tasks where every pixel needs an answer.",
    date: "2026-08-05",
    sections: [
      {
        heading: "Dense prediction, not classification",
        paragraphs: [
          "A standard image classifier answers one question per image: what is this? Dense prediction tasks — segmentation being the main one — ask a different question at every pixel: what does this pixel belong to? The output isn't a label, it's a map the same size as the input.",
          "That changes what the network needs to do well. A classifier can throw away spatial detail as it goes deeper, since it only needs to end up with a single label. A segmentation network can't — it has to end up with an answer for every pixel, which means the fine spatial detail it discards early has to come back somehow.",
        ],
      },
      {
        heading: "Encoder, decoder, and the bottleneck between them",
        paragraphs: [
          "U-Net is built as two halves. The encoder is a fairly ordinary convolutional stack — repeated convolution and downsampling — that shrinks the spatial resolution while building up a richer, more abstract feature representation at each stage. By the bottleneck, the network has strong context about what's in the image but very little spatial precision left.",
          "The decoder mirrors the encoder in reverse: repeated upsampling and convolution, expanding the feature map back out to the original resolution. Left on its own, this half would be reconstructing fine detail from a representation that's already lost most of it — which is where the architecture's actual contribution comes in.",
        ],
      },
      {
        heading: "Skip connections",
        paragraphs: [
          "At each resolution level, U-Net feeds the corresponding encoder features directly across to the decoder, concatenating them with the upsampled features at that stage. This gives the decoder access to the fine spatial detail that existed before it was downsampled away, alongside the higher-level context coming up from the bottleneck.",
          "That combination — coarse context from the bottleneck, fine detail from the skip connections — is why the architecture produces sharp, well-localized output maps instead of blurry ones, and it's the part of the design that made it worth naming.",
        ],
      },
      {
        heading: "Why it's relevant here",
        paragraphs: [
          "Segmentation-style dense prediction shows up anywhere a system needs to understand a scene at pixel resolution rather than just labeling the whole frame — obstacle boundaries, terrain classification, defect localization. Encoder-decoder architectures with skip connections are the standard starting point for that class of problem, and variants of U-Net remain a reasonable default when the target hardware is constrained enough that a heavier model isn't an option.",
        ],
      },
    ],
  },
  {
    slug: "currently-in-the-lab",
    title: "Currently in the Lab",
    excerpt:
      "A short note on what's active and unfinished right now — this is a live feed, not a highlight reel.",
    date: "2026-08-18",
    sections: [
      {
        paragraphs: [
          "Most of what we post here will be finished write-ups. This one isn't — it's a snapshot of what's actively on the bench, before any of it has settled into a result. We're publishing it anyway, because we'd rather this page read as a live research feed than a set of polished announcements after the fact.",
        ],
      },
      {
        heading: "What's active",
        paragraphs: [
          "A sensor fusion pipeline built around an EKF, currently in the tuning phase — working through noise covariance estimates for a multi-sensor rig rather than the filter structure itself.",
          "A segmentation model evaluation for a compute-constrained target: testing how far a U-Net-style architecture can be trimmed down before accuracy drops past what the application can tolerate.",
          "A swarm coordination simulation, being pushed to larger node counts to see where and how coordination quality degrades as the network grows.",
        ],
      },
      {
        heading: "No promises on timing",
        paragraphs: [
          "None of the above has a committed publish date. When something here reaches a result worth writing up properly, it'll get its own post — this one will just keep reflecting whatever's currently in progress.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getSortedPosts(): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const sorted = getSortedPosts();
  const index = sorted.findIndex((post) => post.slug === slug);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
