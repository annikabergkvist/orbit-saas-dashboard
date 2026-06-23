import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardOpenIssuePreviews } from "@/lib/issues-data"

const cardTextLinkClass =
  "mt-2 inline-flex h-auto items-center gap-1 bg-transparent px-0 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

/** Team open issues preview — personal work lives in My Tasks below. */
export function OpenIssuesCard() {
  const issues = getDashboardOpenIssuePreviews("team")

  return (
    <Card glass="subtle">
      <CardHeader className="px-7 pt-3">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          Open Issues
        </CardTitle>
      </CardHeader>
      <CardContent className="px-7 pb-1">
        {issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-foreground/10 bg-card px-4 py-3.5"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    size="lg"
                    className="shrink-0 bg-muted text-foreground after:border-foreground/10"
                  >
                    <AvatarImage src={issue.avatarUrl} alt="" />
                    <AvatarFallback className="bg-muted text-xs font-semibold">
                      {initials(issue.assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-foreground">
                      {issue.assignee}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {issue.description}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      nativeButton={false}
                      className="mt-3 h-8 gap-0.5 rounded-full border border-border/80 bg-muted/60 px-3.5 text-xs font-medium text-foreground shadow-none hover:bg-muted/40"
                      render={<Link href={`/issues?issue=${issue.id}`} />}
                    >
                      Check
                      <ChevronRightIcon className="size-3.5 opacity-70" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-foreground/15 bg-card/40 px-4 py-6 text-center text-sm text-muted-foreground">
            No open team issues right now.
          </p>
        )}
        <Link href="/issues" className={cardTextLinkClass}>
          See all issues
          <ChevronRightIcon className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
