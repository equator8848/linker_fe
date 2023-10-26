git add .

if [ "$1" ]; then
    msg=$1
else
    msg="update code at `date`"
fi

git commit -m "$msg"

git push origin master