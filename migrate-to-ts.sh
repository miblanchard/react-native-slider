#!/bin/bash
########################################################
#
# Name: migrate-to-ts.sh
#
# !!!IMPORTANT NOTE!!! Before usage need to remove pre-commit.
# Migrate to TS in 2 phases.
# 1 phase: just renames all files and commits to preserve the history
# 2 phase: applies `flow-to-ts` utils and `prettier` and commits the result.
#
# Usage:    migrate-to-ts.sh <dir_name>
# Example:  migrate-to-ts.sh ./packages/components/src
#
##########################################################
usage="Usage: migrate-to-ts.sh <dir_name>"
#
# Step 1. Validation.
#
[[ -n "$1" ]] || { echo "$usage" >&2; exit 1; }
dir_name=$1
#
# Step 2. Rename all the files.
#
[[ -e "$dir_name" ]] || { echo "The directory $dir_name doesn't exist." >&2; exit 1; }
find "${dir_name}" -name '*.js' -exec yarn flow-to-ts --arrow-parens always --prettier --semi --write --delete-source {} \;
ts_would_be_files=$(find "${dir_name}" -name '*.ts')
tsx_would_be_files=$(find "${dir_name}" -name '*.tsx')
git restore "${dir_name}"
git clean -f "${dir_name}"
for file in ${ts_would_be_files}; do
    git mv "${file%.*}.js" "${file}"
done
for file in ${tsx_would_be_files}; do
    git mv "${file%.*}.js" "${file}"
done
git add .
git commit --no-verify -m "Moved JS files to TS and TSX"
#
# Step 3. Apply `flow-to-ts` and `prettier` utils.
#
find "${dir_name}" -name '*.ts' -exec yarn flow-to-ts --arrow-parens always --prettier --semi --write {} \;
find "${dir_name}" -name '*.tsx' -exec yarn flow-to-ts --arrow-parens always --prettier --semi --write {} \;
git add .
git commit --no-verify -m "Applied flow-to-ts and prettier utils"
