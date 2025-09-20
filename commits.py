#!/usr/bin/env python3
"""
generate_fake_commits.py
Usage:
  python generate_fake_commits.py --repo /path/to/SaeedX302-goGreen --commits 1
"""
import argparse, subprocess, os
from datetime import datetime, timedelta

def run(cmd, env=None, cwd=None):
    return subprocess.run(cmd, shell=True, check=True, env=env, cwd=cwd)

def main():
    p = argparse.ArgumentParser(description="Generate backdated commits for a repo")
    p.add_argument("--repo", required=True, help="Path to local git repo (SaeedX302-goGreen)")
    p.add_argument("--start", default="2023-01-01", help="Start date (YYYY-MM-DD)")
    p.add_argument("--end", default="2023-12-31", help="End date (inclusive, YYYY-MM-DD)")
    p.add_argument("--commits", type=int, default=1, help="Commits per day (intensity)")
    p.add_argument("--file", default="activity.log", help="File to append changes to")
    args = p.parse_args()

    repo = os.path.abspath(args.repo)
    if not os.path.isdir(os.path.join(repo, ".git")):
        raise SystemExit("Error: path is not a git repo: " + repo)

    start = datetime.strptime(args.start, "%Y-%m-%d").date()
    end = datetime.strptime(args.end, "%Y-%m-%d").date()
    day = start

    # ensure file exists
    open(os.path.join(repo, args.file), "a").close()

    while day <= end:
        for i in range(args.commits):
            # create a slightly different time each commit
            commit_time = datetime.combine(day, datetime.min.time()) + timedelta(hours=12, seconds=i)
            iso = commit_time.strftime("%Y-%m-%d %H:%M:%S")
            with open(os.path.join(repo, args.file), "a", encoding="utf-8") as f:
                f.write(f"{iso} - fake commit {i+1}\n")

            run(f'git add {args.file}', cwd=repo)

            env = os.environ.copy()
            # set author/committer date
            env["GIT_AUTHOR_DATE"] = iso
            env["GIT_COMMITTER_DATE"] = iso
            # optional: set a consistent author name/email (comment out if you want default)
            # env["GIT_AUTHOR_NAME"] = "SaeedX302"
            # env["GIT_AUTHOR_EMAIL"] = "your-email@example.com"

            # commit
            run(f'git commit -m "fake commit on {day} #{i+1}" --quiet', env=env, cwd=repo)
        day += timedelta(days=1)

    print("Done. Now run: git push origin <branch> (from the repo)")

if __name__ == "__main__":
    main()
