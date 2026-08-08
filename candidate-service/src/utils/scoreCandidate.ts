export function calculateTalentScore(resume: any) {
  let coding = 0;
  let innovation = 0;
  let teamwork = 0;

  if (resume.skills?.length)
    coding += Math.min(resume.skills.length * 5, 40);

  if (resume.projects?.length)
    innovation += Math.min(resume.projects.length * 10, 30);

  if (resume.experience?.length)
    teamwork += Math.min(resume.experience.length * 10, 30);

  const total = coding + innovation + teamwork;

  return {
    total,
    breakdown: {
      coding,
      innovation,
      teamwork,
    },
  };
}