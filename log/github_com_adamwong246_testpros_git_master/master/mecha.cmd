rm -rf ./log/github_com_adamwong246_testpros_git_master/master;  mkdir -p ./log/github_com_adamwong246_testpros_git_master/master;  cd ./pen/github_com_adamwong246_testpros_git_master &&  git fetch origin &&  git checkout master &&  docker build -t github_com_adamwong246_testpros_git_master . && docker attach $(docker run -i -d github_com_adamwong246_testpros_git_master npm run lint) &> ../../log/github_com_adamwong246_testpros_git_master/master/lint.out && docker attach $(docker run -i -d github_com_adamwong246_testpros_git_master npm run test) &> ../../log/github_com_adamwong246_testpros_git_master/master/test.out